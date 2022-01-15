import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { dev } from '../../config/config';
import storage from '../helpers/storage';
import { DATA_KEY } from './../constants/storage';
import { reducer as persistedConfigReducer } from './slices/config';
import { reducer as persistedMetaReducer } from './slices/meta';
import personal, { SetTransform as PersonalSetTransform } from './slices/personal';
import subscriptions, { SetTransform as SubscriptionsSetTransform } from './slices/subscriptions';
import sync from './slices/sync';

export const rootReducer = combineReducers({
  config: persistedConfigReducer,
  meta: persistedMetaReducer,
  personal: personal.reducer,
  subscriptions: subscriptions.reducer,
  sync: sync.reducer
});

const persistedReducer = persistReducer({
  keyPrefix: '',
  key: DATA_KEY,
  storage: storage,
  whitelist: ['personal', 'subscriptions'],
  transforms: [PersonalSetTransform, SubscriptionsSetTransform],
  // serialize: false,
  debug: dev
}, rootReducer);

export default persistedReducer;
