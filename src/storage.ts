import { dataKey, fallbackDataKeys } from './constants/storage';
import Storage from './models/Storage';

const keys = [
  dataKey,
  ...fallbackDataKeys
];

const storage = new Storage(keys);

export default storage;
