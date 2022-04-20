import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTransform } from 'redux-persist';
import type { ActionType } from 'typesafe-actions';
import * as TEXTS from '../../constants/texts';
import Subscription, { IBaseRemoteSubscription, ISerializedSubscription } from '../../models/Subscription';
import { selectSubscriptions } from '../selectors';
import type { TRootState } from '../store';

interface ITogglePayload {
  index: number;
  enabled?: boolean;
}

type TAsyncThunkConfig = {
  state: TRootState;
  rejectValue: string;
  rejectedMeta: {
    subscription: Subscription;
  };
};

const initialState: Subscription[] = [];

/**
 * load the remote subscription data
 */
export const load = createAsyncThunk<IBaseRemoteSubscription, number, TAsyncThunkConfig>(
  'subscriptions/load',
  async (index, thunk) => {
    const state = thunk.getState();
    const subscriptions = selectSubscriptions(state);
    const subscription = subscriptions[index];
    try {
      const baseRemoteSubscription = await subscription.fetch();
      if (baseRemoteSubscription) {
        return baseRemoteSubscription;
      }
      return thunk.rejectWithValue(TEXTS.SUBSCRIPTION_ERROR_INVALID_DATA_FORMAT, { subscription });
    } catch (err) {
      console.error(err);
      return thunk.rejectWithValue(TEXTS.SUBSCRIPTION_ERROR_FAILED_TO_FETCH, { subscription });
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
      const subscription = state[index];
      subscription.enabled = enabled ?? !subscription.enabled;
    },
    update: (state, action: PayloadAction<Subscription[] | ISerializedSubscription[]>) => {
      const { payload: subscriptions } = action;
      return subscriptions.map(Subscription.deserialize);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(load.pending, (state, action) => {
      const { arg: index } = action.meta;
      const subscription = state[index];
      subscription.loaded = false;
      subscription.loading = true;
      subscription.error = undefined;
    });
    builder.addCase(load.fulfilled, (state, action) => {
      const { arg: index } = action.meta;
      const { payload } = action;
      const subscription = state[index];
      subscription.update(payload);
      subscription.loaded = true;
      subscription.loading = false;
      subscription.error = undefined;
    });
    builder.addCase(load.rejected, (state, action) => {
      const { arg: index } = action.meta;
      const { payload } = action;
      const subscription = state[index];
      subscription.loaded = true;
      subscription.loading = false;
      subscription.error = payload;
    });
  }
});

type TState = ReturnType<typeof slice.reducer>;

export const SetTransform = createTransform<TState, ISerializedSubscription[]>(
  /**
   * serialize the data for storage
   */
  (subscriptions, key) => {
    return subscriptions.map((subscription) => subscription.serialize());
  },
  /**
   * deserialize the stored data
   */
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

// export type TActions = ReturnType<typeof slice.actions[keyof typeof slice.actions]>;
export type TActions = ActionType<typeof slice.actions>;

export default slice;
