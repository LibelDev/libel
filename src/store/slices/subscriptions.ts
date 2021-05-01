import { createAsyncThunk, createSlice, original, PayloadAction } from '@reduxjs/toolkit';
import { selectSubscriptions } from '../selectors';
import { RootState } from '../store';
import * as TEXTS from '../../constants/texts';
import Subscription from '../../models/Subscription';

interface ITogglePayload {
  subscription: Subscription;
  enabled?: boolean;
}

const initialState: Subscription[] = [];

export const load = createAsyncThunk(
  'subscriptions/load',
  async (index: number, thunk) => {
    const subscriptions = selectSubscriptions(thunk.getState() as RootState);
    const subscription = subscriptions[index];
    try {
      const remoteSubscription = await subscription.fetch();
      if (remoteSubscription) {
        return remoteSubscription;
      }
    } catch (err) {
      console.error(err);
      return thunk.rejectWithValue(TEXTS.SUBSCRIPTION_FETCH_ERROR);
    }
    return thunk.rejectWithValue(TEXTS.SUBSCRIPTION_VALIDATION_ERROR);
  }
);

const slice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Subscription>) => {
      const { payload: subscription } = action;
      state.push(subscription);
    },
    remove: (state, action: PayloadAction<Subscription>) => {
      const { payload: subscription } = action;
      const index = original(state)?.indexOf(subscription)!;
      state.splice(index, 1);
    },
    toggle: (state, action: PayloadAction<ITogglePayload>) => {
      const { subscription, enabled } = action.payload;
      const index = original(state)?.indexOf(subscription)!;
      state[index].enabled = enabled ?? !state[index].enabled;
    },
    update: (state, action: PayloadAction<Subscription[]>) => {
      const { payload: subscriptions } = action;
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
      const { payload: remoteSubscription } = action;
      const subscription = state[index];
      subscription.data = remoteSubscription.data;
      subscription.name = remoteSubscription.name;
      subscription.version = remoteSubscription.version;
      subscription.homepage = remoteSubscription.homepage;
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


export const { add, remove, toggle, update } = slice.actions;

export default slice;
