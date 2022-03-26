import React, { useContext } from 'react';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import styles from './Header.module.scss';
import IDsContext from './IDsContext';

interface IProps {
  onClose: () => void;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'div'>;

const Header: React.FunctionComponent<TProps> = (props) => {
  const { onClose, children } = props;
  const { title: id } = useContext(IDsContext);
  return (
    <div className={styles.header}>
      <h2 id={id} className={styles.title}>
        {children}
      </h2>
      <IconButton
        className={styles.close}
        icon={IconName.Close}
        onClick={onClose}
      />
    </div>
  );
};

export default Header;
