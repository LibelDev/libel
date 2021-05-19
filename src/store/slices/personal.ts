import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTransform } from 'redux-persist';
import { StateType } from 'typesafe-actions';
import Personal, { IPersonal, ISerializedPersonal } from '../../models/Personal';
import { IPost } from '../../types/post';

export interface IAddLabelPayload {
  user: string;
  text: string;
  reason: string;
  source: IPost;
  image?: string;
}

interface IEditLabelPayload {
  user: string;
  index: number;
  text: string;
  reason: string;
  image?: string;
}

interface IRemoveLabelPayload {
  user: string;
  index: number;
}

const initialState: Personal = new Personal();

const slice = createSlice({
  name: 'personal',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<IAddLabelPayload>) => {
      const { user, text, reason, source, image } = action.payload;
      state.add(user, text, reason, source, image);
    },
    edit: (state, action: PayloadAction<IEditLabelPayload>) => {
      const { user, index, text, reason, image } = action.payload;
      state.edit(user, index, text, reason, image);
    },
    remove: (state, action: PayloadAction<IRemoveLabelPayload>) => {
      const { user, index } = action.payload;
      state.remove(user, index);
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
