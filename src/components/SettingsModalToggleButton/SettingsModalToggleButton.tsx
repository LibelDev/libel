import type React from 'react';
import { useCallback, useState } from 'react';
import logo from '../../../assets/logos/libel.png';
import { displayName } from '../../../package.json';
import IconButton from '../IconButton/IconButton';
import SettingsModal from '../SettingsModal/SettingsModal';
import styles from './SettingsModalToggleButton.module.scss';

const icon = (
  <img className={styles.logo} src={logo} />
);

const SettingsModalToggleButton: React.FunctionComponent = () => {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <IconButton
        icon={icon}
        onClick={handleClick}
        aria-label={displayName}
        data-tip={displayName}
        title={displayName}
      />
      <SettingsModal
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

SettingsModalToggleButton.displayName = 'SettingsModalToggleButton';

export default SettingsModalToggleButton;
