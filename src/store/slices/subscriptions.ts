import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { original } from 'immer';
import { createTransform } from 'redux-persist';
import { StateType } from 'typesafe-actions';
import * as TEXTS from '../../constants/texts';
import Subscription, { IRemoteSubscription, ISerializedSubscription } from '../../models/Subscription';

interface ITogglePayload {
  subscription: Subscription;
  enabled?: boolean;
}

const initialState: Subscription[] = [];

/**
 * load the remote subscription data
 */
const load = createAsyncThunk<IRemoteSubscription, Subscription>(
  'subscriptions/load',
  async (subscription, thunk) => {
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
    remove: (state, action: PayloadAction<Subscription>) => {
      const { payload: subscription } = action;
      const index = state.findIndex(({ url }) => url === subscription.url)!;
      state.splice(index, 1);
    },
    toggle: (state, action: PayloadAction<ITogglePayload>) => {
      const { subscription, enabled } = action.payload;
      const index = state.findIndex(({ url }) => url === subscription.url)!;
      const _subscription = state[index];
      _subscription.enabled = enabled ?? !_subscription.enabled;
    },
    update: (state, action: PayloadAction<(Subscription | ISerializedSubscription)[]>) => {
      const { payload } = action;
      const subscriptions = payload.map(Subscription.deserialize);
      return subscriptions;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(load.pending, (state, action) => {
      const { arg: subscription } = action.meta;
      const _subscription = state.find(({ url }) => url === subscription.url)!;
      _subscription.loading = true;
      _subscription.error = undefined;
    });
    builder.addCase(load.fulfilled, (state, action) => {
      const { arg: subscription } = action.meta;
      const { payload } = action;
      const _subscription = state.find(({ url }) => url === subscription.url)!;
      _subscription.update(payload);
      _subscription.loaded = true;
      _subscription.loading = false;
      _subscription.error = undefined;
    });
    builder.addCase(load.rejected, (state, action) => {
      const { arg: subscription } = action.meta;
      const { payload, error } = action;
      // const subscriptions = original<Subscription[]>(state)!;
      // const index = subscriptions.indexOf(subscription);
      const _subscription = state.find(({ url }) => url === subscription.url)!;
      _subscription.loading = false;
      _subscription.error = (payload as any) || error.message;
    });
  }
});

type TState = StateType<typeof slice.reducer>;

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

export default slice;
