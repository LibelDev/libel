import React from 'react';
import logo from '../../../../assets/logos/libel.png';
import { displayName } from '../../../../package.json';
import styles from './Header.scss';

const Header: React.FunctionComponent = () => {
  return (
    <div className={styles.header}>
      <img className={styles.logo} src={logo} alt='' />
      {displayName}
    </div>
  );
};

export default Header;
