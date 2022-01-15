import { persistReducer } from 'redux-persist';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage from '../../helpers/storage';
import Config from '../../models/Config';

export const initialState = new Config();

const slice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setIsIconMapUnlocked: (state, action: PayloadAction<boolean>) => {
      const { payload } = action;
      state.isIconMapUnlocked = payload;
    }
  },
});

export const actions = {
  ...slice.actions
};

export const reducer = persistReducer({
  keyPrefix: '',
  key: 'config',
  storage: storage,
  whitelist: ['isIconMapUnlocked']
}, slice.reducer);

export default slice;
