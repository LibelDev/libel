import type React from 'react';
import { useMemo, useState } from 'react';
import { displayName } from '../../../package.json';
import Modal, { TProps as TModalProps } from '../Modal/Modal';
import Settings from '../Settings/Settings';
import styles from './SettingsModal.module.scss';
import SettingsModalFocusTrapContext, { IValue as ISettingsModalFocusTrapContextValue } from './SettingsModalFocusTrapContext';

interface IProps { }

type TComponentProps = TModalProps;

type TProps = IProps & TComponentProps;

const SettingsModal: React.FunctionComponent<TProps> = (props) => {
  const { onClose, ...otherProps } = props;

  const [isFocusTrapPaused, setIsFocusTrapPaused] = useState(false);

  const focusTrapContextValue: ISettingsModalFocusTrapContextValue = useMemo(() => ({
    unpause: () => { setIsFocusTrapPaused(false); },
    pause: () => { setIsFocusTrapPaused(true); }
  }), []);

  return (
    <SettingsModalFocusTrapContext.Provider value={focusTrapContextValue}>
      <Modal {...otherProps} paused={isFocusTrapPaused} onClose={onClose}>
        <Modal.Header onClose={onClose}>
          {displayName}
        </Modal.Header>
        <Modal.Body compact>
          <Settings className={styles.settings} />
        </Modal.Body>
      </Modal>
    </SettingsModalFocusTrapContext.Provider>
  );
};

SettingsModal.displayName = 'SettingsModal';

export default SettingsModal;
