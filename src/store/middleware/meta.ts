import { Middleware } from '@reduxjs/toolkit';
import { actions as metaActions } from '../slices/meta';
import type { TRootState } from '../store';

interface IOptions {
  whitelist?: string[];
  // blacklist?: string[];
}

export const createLastModifiedTimeUpdater = (options: IOptions = {}): Middleware<{}, TRootState> => (store) => (next) => (action) => {
  const { dispatch } = store;
  const result = next(action);
  const { whitelist = [] } = options;
  const index = whitelist.indexOf(action.type);
  if (index >= 0) {
    const now = Date.now();
    dispatch(metaActions.setLastModifiedTime(now));
  }
  return result;
};
