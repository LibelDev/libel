import { useContext } from 'react';
import SettingsModalFocusTrapContext from '../components/SettingsModal/SettingsModalFocusTrapContext';

const useSettingsModalFocusTrap = () => {
  return useContext(SettingsModalFocusTrapContext);
};

export default useSettingsModalFocusTrap;
