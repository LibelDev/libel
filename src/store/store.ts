import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { StateType } from 'typesafe-actions';
import { DeepReadonly } from 'utility-types';
import { namespace } from '../../package.json';
import * as env from '../helpers/env';
import storage from '../storage';
import reducer, { rootReducer } from './reducer';
import { actions as subscriptionsActions } from './slices/subscriptions';

const store = configureStore({
  devTools: env.dev,
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(
    createStateSyncMiddleware({
      channel: namespace,
      blacklist: [
        // subscriptionsActions.load.pending.type,
        FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
      ]
    })
  )
});

initMessageListener(store);

export const persistor = persistStore(store, null, async () => {
  await storage.ready();
  const { dispatch } = store;
  const { subscriptions } = storage;
  for (let i = 0; i < subscriptions.length; i++) {
    dispatch(subscriptionsActions.load(i));
  }
});

export type TRootState = DeepReadonly<StateType<typeof rootReducer>>;

export type TAppDispatch = typeof store.dispatch;

export default store;
