import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTransform } from 'redux-persist';
import { StateType } from 'typesafe-actions';
import * as TEXTS from '../../constants/texts';
import Subscription, { ISerializedSubscription } from '../../models/Subscription';
import { selectSubscriptions } from '../selectors';
import { TRootState } from '../store';

interface ITogglePayload {
  index: number;
  enabled?: boolean;
}

const initialState: Subscription[] = [];

const load = createAsyncThunk(
  'subscriptions/load',
  async (index: number, thunk) => {
    const state = thunk.getState() as TRootState;
    const subscriptions = selectSubscriptions(state);
    const subscription = subscriptions[index];
    try {
      const remoteSubscription = await subscription.fetch();
      if (remoteSubscription) {
        return remoteSubscription;
      }
      return thunk.rejectWithValue(TEXTS.SUBSCRIPTION_VALIDATION_ERROR);
    } catch (err) {
      console.error(err);
      return thunk.rejectWithValue(TEXTS.SUBSCRIPTION_FETCH_ERROR);
    }
  }
);

const slice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Subscription | ISerializedSubscription>) => {
      const { payload } = action;
      const subscription = Subscription.deserialize(payload);
      state.push(subscription);
    },
    remove: (state, action: PayloadAction<number>) => {
      const { payload: index } = action;
      state.splice(index, 1);
    },
    toggle: (state, action: PayloadAction<ITogglePayload>) => {
      const { index, enabled } = action.payload;
      state[index].enabled = enabled ?? !state[index].enabled;
    },
    update: (state, action: PayloadAction<(Subscription | ISerializedSubscription)[]>) => {
      const { payload } = action;
      const subscriptions = payload.map(Subscription.deserialize);
      return subscriptions;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(load.pending, (state, action) => {
      const { arg: index } = action.meta;
      const subscription = state[index];
      subscription.loading = true;
      subscription.error = undefined;
    });
    builder.addCase(load.fulfilled, (state, action) => {
      const { arg: index } = action.meta;
      const { payload } = action;
      const subscription = state[index];
      subscription.update(payload);
      subscription.loading = false;
      subscription.error = undefined;
    });
    builder.addCase(load.rejected, (state, action) => {
      const { arg: index } = action.meta;
      const { payload, error } = action;
      const subscription = state[index];
      subscription.loading = false;
      subscription.error = (payload as any) || error.message;
    });
  }
});

type TState = StateType<typeof slice.reducer>;

export const SetTransform = createTransform<TState, ISerializedSubscription[]>(
  (subscriptions, key) => {
    return subscriptions.map((subscription) => subscription.serialize());
  },
  (outboundState, key) => {
    return outboundState.map(Subscription.deserialize);
  },
  {
    whitelist: ['subscriptions']
  }
);

export const actions = {
  ...slice.actions,
  load
};

export default slice;
