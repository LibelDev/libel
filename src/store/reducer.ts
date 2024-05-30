import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { dev } from '../../config/config';
import { DATA_KEY } from '../constants/storage';
import storage from '../helpers/storage';
import { persistedReducer as persistedConfigReducer, type TActions as TConfigActions } from './slices/config';
import { persistedReducer as persistedMetaReducer, type TActions as TMetaActions } from './slices/meta';
import personal, { SetTransform as PersonalSetTransform, type TActions as TPersonalActions } from './slices/personal';
import subscriptions, { SetTransform as SubscriptionsSetTransform, type TActions as TSubscriptionsActions } from './slices/subscriptions';
import sync, { type TActions as TSyncActions } from './slices/sync';

export type TActions = (
  TConfigActions |
  TMetaActions |
  TPersonalActions |
  TSubscriptionsActions |
  TSyncActions
);

const reducer = combineReducers({
  config: persistedConfigReducer,
  meta: persistedMetaReducer,
  personal: personal.reducer,
  subscriptions: subscriptions.reducer,
  sync: sync.reducer
});

export const persistedReducer = persistReducer({
  keyPrefix: '',
  key: DATA_KEY,
  storage: storage,
  whitelist: ['personal', 'subscriptions'],
  transforms: [PersonalSetTransform, SubscriptionsSetTransform],
  // serialize: false,
  debug: dev
}, reducer);

export default reducer;
