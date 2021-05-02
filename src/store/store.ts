import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { StateType } from 'typesafe-actions';
import { DeepReadonly } from 'utility-types';
import persistor from './middleware/persistor';
import personal, * as personalActions from './slices/personal';
import subscriptions, * as subscriptionsActions from './slices/subscriptions';
import * as env from '../helpers/env';
import Storage from '../models/Storage';

export const reducer = combineReducers({
  personal: personal.reducer,
  subscriptions: subscriptions.reducer
});

const store = configureStore({
  devTools: env.dev,
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(
    persistor()
  )
});

export const loadStorageIntoStore = (storage: Storage) => {
  const { personal, subscriptions } = storage;
  store.dispatch(personalActions.update(personal));
  store.dispatch(subscriptionsActions.update(subscriptions));
  for (let i = 0; i < subscriptions.length; i++) {
    store.dispatch(subscriptionsActions.load(i));
  }
};

export type RootState = DeepReadonly<StateType<typeof reducer>>;

export type AppDispatch = typeof store.dispatch;

export default store;
