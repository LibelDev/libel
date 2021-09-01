import React from 'react';
import { displayName } from '../../../../package.json';
import styles from './Header.scss';

const Header: React.FunctionComponent = () => {
  return (
    <div className={styles.header}>
      {displayName}
    </div>
  );
};

export default Header;
