import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { ActionType } from 'typesafe-actions';
import storage from '../../helpers/storage';
import Meta from '../../models/Meta';

const initialState = Meta.factory();

const slice = createSlice({
  name: 'meta',
  initialState,
  reducers: {
    setLastModifiedTime: (state, action: PayloadAction<number>) => {
      state.lastModifiedTime = action.payload;
    },
    setLastSyncedTime: (state, action: PayloadAction<number>) => {
      state.lastSyncedTime = action.payload;
    },
  },
});

export const { actions } = slice;

// export type TActions = ReturnType<typeof actions[keyof typeof actions]>;
export type TActions = ActionType<typeof slice.actions>;

export const persistedReducer = persistReducer({
  keyPrefix: '',
  key: 'meta',
  storage: storage,
  whitelist: ['lastModifiedTime', 'lastSyncedTime']
}, slice.reducer);

export default slice;
