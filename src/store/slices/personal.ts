import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTransform } from 'redux-persist';
import { StateType } from 'typesafe-actions';
import Label, { ISource } from '../../models/Label';
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
  label: Label;
  text: string;
  reason?: string;
  color?: string;
  image?: string;
}

interface IRemoveLabelPayload {
  user: string;
  label: Label;
}

const initialState: Personal = new Personal();

const slice = createSlice({
  name: 'personal',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<IAddLabelPayload>) => {
      const { user, text, reason, source, color, image } = action.payload;
      state.add(user, { text, reason, source, color, image });
    },
    edit: (state, action: PayloadAction<IEditLabelPayload>) => {
      const { user, label, text, reason, color, image } = action.payload;
      state.edit(user, label, { text, reason, color, image });
    },
    remove: (state, action: PayloadAction<IRemoveLabelPayload>) => {
      const { user, label } = action.payload;
      state.remove(user, label);
    },
    update: (state, action: PayloadAction<Personal | IPersonal>) => {
      const { payload: personal } = action;
      return personal instanceof Personal ? personal : Personal.deserialize(personal);
    }
  },
});

type TState = StateType<typeof slice.reducer>;

export const SetTransform = createTransform<TState, ISerializedPersonal>(
  (personal, key) => {
    return personal.serialize();
  },
  (outboundState, key) => {
    return Personal.deserialize(outboundState);
  },
  {
    whitelist: ['personal']
  }
);

export const actions = {
  ...slice.actions
};

export default slice;
