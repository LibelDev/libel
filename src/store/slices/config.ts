import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { ActionType } from 'typesafe-actions';
import storage from '../../helpers/storage';
import Config, { IConfig } from '../../models/Config';

const initialState = Config.factory();

const slice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setIsIconMapUnlocked: (state, action: PayloadAction<boolean>) => {
      const { payload } = action;
      state.isIconMapUnlocked = payload;
    },
    update: (state, action: PayloadAction<Config | IConfig>) => {
      const { payload: config } = action;
      return Config.deserialize(config);
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
