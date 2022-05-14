import type React from 'react';
import { displayName } from '../../../package.json';
import Modal, { TProps as TModalProps } from '../Modal/Modal';
import Settings from '../Settings/Settings';
import styles from './SettingsModal.module.scss';

interface IProps { }

type TComponentProps = TModalProps;

type TProps = IProps & TComponentProps;

const SettingsModal: React.FunctionComponent<TProps> = (props) => {
  const { onClose, ...otherProps } = props;

  return (
    <Modal {...otherProps} onClose={onClose}>
      <Modal.Header>
        {displayName}
      </Modal.Header>
      <Modal.Body compact>
        <Settings className={styles.settings} />
      </Modal.Body>
    </Modal>
  );
};

SettingsModal.displayName = 'SettingsModal';

export default SettingsModal;
