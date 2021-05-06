import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IStorage } from '../../models/Storage';
import storage from '../../storage';

interface IConfig {
  whitelist?: string[];
  blacklist?: string[];
}

const persistor = (config: IConfig = {}): Middleware<{}, RootState> => (store) => (next) => (action) => {
  const { whitelist = [], blacklist = [] } = config;
  const value = next(action);
  if (whitelist.indexOf(action.type) >= 0 || blacklist.indexOf(action.type) === -1) {
    const state = store.getState();
    storage.update(state as IStorage).save();
  }
  return value;
};

export default persistor;
