import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IStorage } from '../../models/Storage';
import storage from '../../storage';

const persistor = (): Middleware<{}, RootState> => (store) => (next) => (action) => {
  const value = next(action);
  const state = store.getState();
  storage.update(state as IStorage);
  return value;
};

export default persistor;
