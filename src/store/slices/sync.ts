import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionType } from 'typesafe-actions';

interface IState {
  loading: boolean;
  error: unknown | null;
}

const initialState: IState = {
  loading: false,
  error: null
};

const slice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      const { payload } = action;
      state.loading = payload;
    },
    setError: (state, action: PayloadAction<unknown | null>) => {
      const { payload } = action;
      state.error = payload;
    }
  },
});

export const { actions } = slice;

// export type TActions = ReturnType<typeof actions[keyof typeof actions]>;
export type TActions = ActionType<typeof slice.actions>;

export default slice;
