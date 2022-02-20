import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTransform } from 'redux-persist';
import { ActionType } from 'typesafe-actions';
import { ISource } from '../../models/Label';
import Personal, { IPersonal, ISerializedPersonal } from '../../models/Personal';

export interface IAddLabelPayload {
  user: string;
  text: string;
  reason?: string;
  source: ISource;
  color?: string;
  image?: string;
}

interface IEditLabelPayload {
  user: string;
  index: number;
  text: string;
  reason?: string;
  color?: string;
  image?: string;
}

interface IRemoveLabelPayload {
  user: string;
  index: number;
}

const initialState = Personal.factory();

const slice = createSlice({
  name: 'personal',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<IAddLabelPayload>) => {
      const { user, text, reason, source, color, image } = action.payload;
      state.add(user, { text, reason, source, color, image });
    },
    edit: (state, action: PayloadAction<IEditLabelPayload>) => {
      const { user, index, text, reason, color, image } = action.payload;
      state.edit(user, index, { text, reason, color, image });
    },
    remove: (state, action: PayloadAction<IRemoveLabelPayload>) => {
      const { user, index } = action.payload;
      state.remove(user, index);
    },
    update: (state, action: PayloadAction<Personal | IPersonal>) => {
      const { payload: personal } = action;
      return Personal.deserialize(personal);
    }
  },
});

type TState = ReturnType<typeof slice.reducer>;

export const SetTransform = createTransform<TState, ISerializedPersonal>(
  /**
   * serialize the data for storage
   */
  (personal, key) => {
    return personal.serialize();
  },
  /**
   * deserialize the stored data
   */
  (outboundState, key) => {
    return Personal.deserialize(outboundState);
  },
  {
    whitelist: ['personal']
  }
);

export const { actions } = slice;

// export type TActions = ReturnType<typeof actions[keyof typeof actions]>;
export type TActions = ActionType<typeof slice.actions>;

export default slice;
