import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { ActionType } from 'typesafe-actions';
import storage from '../../helpers/storage';
import Config from '../../models/Config';

export const initialState: Config = new Config();

const slice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setIsIconMapUnlocked: (state, action: PayloadAction<boolean>) => {
      const { payload } = action;
      state.isIconMapUnlocked = payload;
    }
  }
});

export const { actions } = slice;

// export type TActions = ReturnType<typeof actions[keyof typeof actions]>;
export type TActions = ActionType<typeof slice.actions>;

export const persistedReducer = persistReducer({
  keyPrefix: '',
  key: 'config',
  storage: storage,
  whitelist: ['isIconMapUnlocked']
}, slice.reducer);

export default slice;
