import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from '../../helpers/storage';
import Meta from '../../models/Meta';

export const initialState = new Meta();

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

export const actions = {
  ...slice.actions
};

export const reducer = persistReducer({
  keyPrefix: '',
  key: 'meta',
  storage: storage,
  whitelist: ['lastModifiedTime', 'lastSyncedTime']
}, slice.reducer);

export default slice;
