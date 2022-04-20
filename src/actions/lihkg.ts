import { createAction } from '@reduxjs/toolkit';
import type { ActionType } from 'typesafe-actions';
import type { IIconMap, TNotification } from '../types/lihkg';

enum Action {
  SetIconMap = '$SET_ICON_MAP',
  ShowNotification = 'SHOW_NOTIFICATION',
  RemoveNotification = 'REMOVE_NOTIFICATION'
}

export const setIconMap = createAction<IIconMap, Action.SetIconMap>(Action.SetIconMap);
export const showNotification = createAction<TNotification, Action.ShowNotification>(Action.ShowNotification);
export const removeNotification = createAction<number, Action.RemoveNotification>(Action.RemoveNotification);

export type TActions = ActionType<
  typeof setIconMap
  | typeof showNotification
  | typeof removeNotification
>;
