import { configureStore } from '@reduxjs/toolkit';
import debugFactory from 'debug';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';
import { dev } from '../../config/config';
import { namespace } from '../../package.json';
import Storage from '../models/Storage';
import Subscription from '../models/Subscription';
import storage from '../storage';
import { ISerializedStorage, IStorage } from './../models/Storage';
import { createLastModifiedTimeUpdater } from './middleware/meta';
import reducer, { persistedReducer } from './reducer';
import { actions as configActions } from './slices/config';
import { actions as metaActions } from './slices/meta';
import { actions as personalActions } from './slices/personal';
import { actions as subscriptionsActions } from './slices/subscriptions';
// import { actions as syncActions } from './slices/sync';

const debug = debugFactory('libel:store:store');

/**
 * Store
 */
const store = configureStore({
  devTools: dev,
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(
    createLastModifiedTimeUpdater({
      whitelist: [
        configActions.setIsIconMapUnlocked.type,
        configActions.update.type,
        personalActions.add.type,
        personalActions.edit.type,
        personalActions.remove.type,
        personalActions.update.type,
        subscriptionsActions.add.type,
        subscriptionsActions.remove.type,
        subscriptionsActions.toggle.type,
        subscriptionsActions.update.type
      ]
      // blacklist: [
      //   '&_INIT_MESSAGE_LISTENER', // redux-state-sync
      //   FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
      //   metaActions.setLastModifiedTime.type,
      //   metaActions.setLastSyncedTime.type,
      //   syncActions.setLoading.type,
      //   syncActions.setError.type,
      //   subscriptionsActions.load.pending.type,
      //   subscriptionsActions.load.rejected.type
      // ]
    }),
    createStateSyncMiddleware({
      channel: namespace,
      blacklist: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    })
  )
});

initMessageListener(store);

/**
 * load the subscriptions data from remote  
 * NOTE: this function is not really async (i.e. it resolves immediately)
 * @async
 * @param {Subscription[]} subscriptions 
 */
const loadRemoteSubscriptions = async (subscriptions: Subscription[]) => {
  const { dispatch } = store;
  for (let i = 0; i < subscriptions.length; i++) {
    dispatch(subscriptionsActions.load(i));
  }
};

export const loadDataIntoStore = async (data: IStorage | ISerializedStorage) => {
  debug('loadDataIntoStore:data', data);
  // update the store referring to the storage instance
  const { config, meta, personal, subscriptions } = Storage.deserialize(data);
  if (config) {
    store.dispatch(configActions.update(config));
  }
  if (meta) {
    store.dispatch(metaActions.update(meta));
  }
  store.dispatch(personalActions.update(personal));
  store.dispatch(subscriptionsActions.update(subscriptions));
  await loadRemoteSubscriptions(subscriptions);
  // update the storage instance reference
  storage.update(data);
};

/**
 * Persistor
 */
export const persistor = persistStore(store, null, async () => {
  await storage.ready();
  const { subscriptions } = storage;
  await loadRemoteSubscriptions(subscriptions);
});

export type TRootState = ReturnType<typeof reducer>;
export type TAppDispatch = typeof store.dispatch;

export const useTypedDispatch = () => useDispatch<TAppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<TRootState> = useSelector;

export default store;
