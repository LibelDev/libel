import { DATA_KEY, DEPRECATED_LOCAL_STORAGE_DATA_KEYS } from './constants/storage';
import Storage from './models/Storage';

const keys = [
  DATA_KEY,
  ...DEPRECATED_LOCAL_STORAGE_DATA_KEYS
];

const storage = new Storage(keys);

export default storage;
