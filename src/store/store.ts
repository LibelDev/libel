import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { StateType } from 'typesafe-actions';
import { DeepReadonly } from 'utility-types';
import { dev } from '../../config/config';
import { namespace } from '../../package.json';
import Storage from '../models/Storage';
import Subscription from '../models/Subscription';
import storage from '../storage';
import { ISerializedStorage, IStorage } from './../models/Storage';
import { createLastModifiedTimeUpdater } from './middleware/meta';
import reducer, { rootReducer } from './reducer';
import { selectSubscriptions } from './selectors';
import { actions as metaActions } from './slices/meta';
import { actions as personalActions } from './slices/personal';
import { actions as subscriptionsActions } from './slices/subscriptions';
import { actions as syncActions } from './slices/sync';

/**
 * Store
 */
const store = configureStore({
  devTools: dev,
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(
    createLastModifiedTimeUpdater({
      blacklist: [
        metaActions.setLastModifiedTime.type,
        metaActions.setLastSyncedTime.type,
        syncActions.setLoading.type,
        syncActions.setError.type,
        subscriptionsActions.load.pending.type,
        subscriptionsActions.load.rejected.type
      ]
    }),
    createStateSyncMiddleware({
      channel: namespace,
      blacklist: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    })
  )
});

initMessageListener(store);

const loadRemoteSubscriptions = async () => {
  const { dispatch } = store;
  const state = store.getState();
  const subscriptions = selectSubscriptions(state) as Subscription[];
  for (const subscription of subscriptions) {
    dispatch(subscriptionsActions.load(subscription));
  }
};

export const loadDataIntoStore = async (data: IStorage | ISerializedStorage) => {
  const storage = Storage.deserialize(data);
  const { personal, subscriptions } = storage;
  store.dispatch(personalActions.update(personal));
  store.dispatch(subscriptionsActions.update(subscriptions));
  await loadRemoteSubscriptions();
  return storage;
};

/**
 * Persistor
 */
export const persistor = persistStore(store, null, async () => {
  await storage.ready();
  await loadRemoteSubscriptions();
});

export type TRootState = DeepReadonly<StateType<typeof rootReducer>>;

export type TAppDispatch = typeof store.dispatch;

export default store;
