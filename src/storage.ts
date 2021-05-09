import { dataKey, deprecatedLocalStorageKeys } from './constants/storage';
import Storage from './models/Storage';

const keys = [
  dataKey,
  ...deprecatedLocalStorageKeys
];

const storage = new Storage(keys);

export default storage;
