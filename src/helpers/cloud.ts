import debugFactory from 'debug';
import * as files from '../constants/files';
import storage from '../storage';
import { actions as metaActions } from '../store/slices/meta';
import { actions as syncActions } from '../store/slices/sync';
import store from '../store/store';
import Storage, { ISerializedStorage } from './../models/Storage';
import { selectConfig, selectMeta, selectPersonal, selectSubscriptions } from './../store/selectors';
import { loadDataIntoStore } from './../store/store';
import { compress, decompress } from './file';
import * as gapi from './gapi';
import { mergeConfig, mergeDataSet, MergeDirection, mergeSubscriptions } from './merge';

const debug = debugFactory('libel:helper:cloud');

const download = async (fileId: string) => {
  try {
    const { body } = await gapi.drive.getById<boolean>(fileId, { alt: 'media' });
    const object = decompress(body);
    return Storage.validate(object) as ISerializedStorage;
  } catch (err) {
    // failed to download or decompress the file
    // probably network issue or corrupted app data which is unexpected
    // just ignore it and simply return null
    return null;
  }
};

const upload = (fileId: string, json: string) => {
  const body = compress(json);
  return gapi.drive.update(fileId, body);
};

export const clear = () => {
  return gapi.drive.deleteByName(files.appData);
};

export const sync = async () => {
  const { dispatch } = store;
  dispatch(syncActions.setLoading(true));
  try {
    const [file, fresh] = await gapi.drive.ensure(files.appData);
    if (fresh) {
      // never been synced with the cloud before
      // nothing to do here
    } else {
      const remoteStorage = await download(file.id!);
      debug('sync:remoteStorage', remoteStorage);
      if (remoteStorage) {
        // cloud data downloaded successfully
        const state = store.getState();
        const config = selectConfig(state);
        const meta = selectMeta(state);
        const personal = selectPersonal(state);
        const subscriptions = selectSubscriptions(state);
        const modifiedTime = new Date(file.modifiedTime!).getTime();
        const { lastModifiedTime, lastSyncedTime } = meta;
        debug('sync:meta', lastSyncedTime, lastModifiedTime, modifiedTime);
        /**
         * NOTE: `lastSyncedTime` will never be greater than `modifiedTime`
         *
         * `lastSyncedTime === modifiedTime` => the file was updated from this instance in the previous sync
         * => if `lastModifiedTime > modifiedTime` (i.e. local is newer than remote), merge local into remote
         * => otherwise, merge remote into local
         *
         * `lastSyncedTime < modifiedTime` => the file has been updated from another instance since the previous sync
         * => then always merge remote into local
         */
        // merge with local data
        const mergeDirection = ((lastSyncedTime === modifiedTime) && (lastModifiedTime > modifiedTime)) ? MergeDirection.LocalToIncoming : MergeDirection.IncomingToLocal;
        debug('sync:mergeDirection', MergeDirection[mergeDirection]);
        const [[configA, configB], [personalA, personalB], [subscriptionsA, subscriptionsB]] = (
          mergeDirection === MergeDirection.LocalToIncoming ?
            [[remoteStorage.config, config], [remoteStorage.personal, personal.plain()], [remoteStorage.subscriptions, subscriptions]] :
            [[config, remoteStorage.config], [personal.plain(), remoteStorage.personal], [subscriptions, remoteStorage.subscriptions]]
        );
        const storage: ISerializedStorage = {
          config: mergeConfig(configA, configB, true),
          // CAVEAT: ignore `meta` here
          personal: mergeDataSet(personalA, personalB, true),
          subscriptions: mergeSubscriptions(subscriptionsA, subscriptionsB, true)
        };
        // load the merged data into the store
        await loadDataIntoStore(storage);
      }
    }
    // the storage instance here has already been updated
    const json = storage.json();
    // upload the storage to cloud
    const { result } = await upload(file.id!, json);
    const modifiedTime = new Date(result.modifiedTime!).getTime();
    debug('sync:modifiedTime', modifiedTime);
    dispatch(metaActions.setLastSyncedTime(modifiedTime));
    dispatch(syncActions.setError(null));
  } catch (err) {
    dispatch(syncActions.setError(err));
  }
  dispatch(syncActions.setLoading(false));
};
