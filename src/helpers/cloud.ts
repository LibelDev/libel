import * as files from '../constants/files';
import storage from '../storage';
import { actions as metaActions } from '../store/slices/meta';
import { actions as syncActions } from '../store/slices/sync';
import store from '../store/store';
import Storage, { ISerializedStorage } from './../models/Storage';
import { selectMeta, selectPersonal, selectSubscriptions } from './../store/selectors';
import { loadDataIntoStore } from './../store/store';
import { compress, decompress } from './file';
import * as gapi from './gapi';
import { MergeDirection, mergePersonal, mergeSubscriptions } from './merge';

const download = async (fileId: string) => {
  try {
    const { body } = await gapi.drive.getById<boolean>(fileId, { alt: 'media' });
    const object = decompress(body);
    return Storage.validate(object) as Partial<ISerializedStorage>;
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

export const sync = async () => {
  const { dispatch } = store;
  dispatch(syncActions.setLoading(true));
  try {
    const [response, fresh] = await gapi.drive.ensure(files.appData);
    const { result: file } = response;
    if (fresh) {
      // never been synced with the cloud before
      // nothing to do here
    } else {
      const remoteStorage = (await download(file.id!)) || {};
      // data downloaded successfully
      const state = store.getState();
      const meta = selectMeta(state);
      const personal = selectPersonal(state);
      const subscriptions = selectSubscriptions(state);
      // merge with local data
      const modifiedTime = new Date(file.modifiedTime!).getTime();
      const { lastModifiedTime, lastSyncedTime } = meta;
      // NOTE: `lastSyncedTime` will never be greater than `modifiedTime`
      // `lastSyncedTime === modifiedTime` => the file was updated from this instance in the previous sync
      // => if local is newer than remote, merge local into remote, otherwise, merge remote into local
      // `lastSyncedTime < modifiedTime` => the file has been updated from another instance since the previous sync
      // => then always merge remote into local
      const mergeDirection = ((lastSyncedTime === modifiedTime) && (lastModifiedTime > modifiedTime)) ? MergeDirection.Incoming : MergeDirection.Local;
      const _storage: ISerializedStorage = {
        personal: mergePersonal(personal, remoteStorage.personal, mergeDirection),
        subscriptions: mergeSubscriptions(subscriptions, remoteStorage.subscriptions, mergeDirection)
      };
      // load the merged data into store
      await loadDataIntoStore(_storage);
      storage.update(_storage);
    }
    // upload the data to cloud
    const json = storage.json();
    const { result } = await upload(file.id!, json);
    const lastSyncedTime = new Date(result.modifiedTime!).getTime();
    dispatch(metaActions.setLastSyncedTime(lastSyncedTime));
    dispatch(syncActions.setError(null));
  } catch (err) {
    dispatch(syncActions.setError(err));
  }
  dispatch(syncActions.setLoading(false));
};
