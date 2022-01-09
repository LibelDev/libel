import { DATA_KEY, DEPRECATED_LOCAL_STORAGE_DATA_KEYS, META_KEY } from './constants/storage';
import Storage from './models/Storage';

const keys = [
  DATA_KEY,
  ...DEPRECATED_LOCAL_STORAGE_DATA_KEYS
];

const storage = new Storage(keys, META_KEY);

export default storage;
