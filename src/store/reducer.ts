import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from '../helpers/storage';
import { DATA_KEY } from './../constants/storage';
import personal, { SetTransform as PersonalSetTransform } from './slices/personal';
import subscriptions, { SetTransform as SubscriptionsSetTransform } from './slices/subscriptions';

export const rootReducer = combineReducers({
  personal: personal.reducer,
  subscriptions: subscriptions.reducer
});

const persistedReducer = persistReducer({
  keyPrefix: '',
  key: DATA_KEY,
  storage: storage,
  whitelist: ['personal', 'subscriptions'],
  transforms: [PersonalSetTransform, SubscriptionsSetTransform],
  // serialize: false,
  debug: true
}, rootReducer);

export default persistedReducer;
