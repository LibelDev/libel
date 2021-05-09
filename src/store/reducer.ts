import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import personal, { SetTransform as PersonalSetTransform } from './slices/personal';
import subscriptions, { SetTransform as SubscriptionsSetTransform } from './slices/subscriptions';
import { dataKey } from './../constants/storage';
import storage from '../helpers/storage';

export const rootReducer = combineReducers({
  personal: personal.reducer,
  subscriptions: subscriptions.reducer
});

const persistedReducer = persistReducer({
  keyPrefix: '',
  key: dataKey,
  storage: storage,
  whitelist: ['personal', 'subscriptions'],
  transforms: [PersonalSetTransform, SubscriptionsSetTransform],
  // serialize: false,
  debug: true
}, rootReducer);

export default persistedReducer;
