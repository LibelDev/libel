import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createTransform } from 'redux-persist';
import { StateType } from 'typesafe-actions';
import Personal, { ISerializedPersonal, IPersonal } from '../../models/Personal';
import { IPost } from '../../types/post';

interface IAddLabelPayload {
  user: string;
  text: string;
  reason: string;
  source?: IPost;
}

interface IEditLabelPayload {
  user: string;
  index: number;
  text: string;
  reason: string;
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
      const { user, text, reason, source } = action.payload;
      state.add(user, text, reason, source);
    },
    edit: (state, action: PayloadAction<IEditLabelPayload>) => {
      const { user, index, text, reason } = action.payload;
      state.edit(user, index, text, reason);
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

type State = StateType<typeof slice.reducer>;

export const SetTransform = createTransform<State, ISerializedPersonal>(
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
