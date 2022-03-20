import { createAction } from '@reduxjs/toolkit';
import type { IIconMap } from '../types/lihkg';

enum Action {
  SetIconMap = '$SET_ICON_MAP'
}

export const setIconMap = createAction<IIconMap, Action.SetIconMap>(Action.SetIconMap);
