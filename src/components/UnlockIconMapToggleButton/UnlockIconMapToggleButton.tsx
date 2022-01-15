import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as lihkgActions from '../../actions/lihkg';
import * as TEXTS from '../../constants/texts';
import { getStore, unlockIconMap } from '../../helpers/lihkg';
import { selectConfig } from '../../store/selectors';
import { actions as configActions } from '../../store/slices/config';
import { IIconMap } from '../../types/lihkg';
import ToggleButton from '../ToggleButton/ToggleButton';

let originalIconMap: IIconMap | undefined;
let unlockedIconMap: IIconMap | undefined;

const UnlockIconMapToggleButton = () => {
  const dispatch = useDispatch();
  const { isIconMapUnlocked } = useSelector(selectConfig);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked } = event.target;
    dispatch(configActions.setIsIconMapUnlocked(checked));
  }, []);

  useEffect(() => {
    const store = getStore(); // original LIHKG redux store
    const { dispatch, getState } = store!;
    if (isIconMapUnlocked) {
      const state = getState();
      if (!originalIconMap) {
        originalIconMap = state.app.iconMap as IIconMap;
      }
      if (!unlockedIconMap) {
        unlockedIconMap = unlockIconMap(originalIconMap);
      }
      // spread the object due to object being not extensible
      // otherwise it will lead to error in the LIHKG main script
      dispatch(lihkgActions.setIconMap({ ...unlockedIconMap }));
    } else {
      if (originalIconMap) {
        dispatch(lihkgActions.setIconMap(originalIconMap));
      }
    }
  }, [isIconMapUnlocked]);

  return (
    <ToggleButton small flip checked={isIconMapUnlocked} onChange={handleChange}>
      {TEXTS.UNLOCK_ICON_MAP_TOGGLE_BUTTON_TEXT}
    </ToggleButton>
  );
};

export default UnlockIconMapToggleButton;
