import { IIconMap } from '../types/lihkg';

enum Action {
  SetIconMap = '$SET_ICON_MAP'
}

export const setIconMap = (payload: IIconMap) => ({
  type: Action.SetIconMap,
  payload
});
