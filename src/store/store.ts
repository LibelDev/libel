import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { StateType } from 'typesafe-actions';
import { DeepReadonly } from 'utility-types';
import persistor from './middleware/persistor';
import personal from './slices/personal';
import subscriptions, * as subscriptionsActions from './slices/subscriptions';
import * as env from '../helpers/env';

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

export type RootState = DeepReadonly<StateType<typeof reducer>>;

export type AppDispatch = typeof store.dispatch;

export default store;
