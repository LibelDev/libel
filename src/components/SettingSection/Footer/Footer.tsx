import React from 'react';
import { displayName, repository, version } from '../../../../package.json';
import { LICENSE, SOURCE_CODE } from '../../../constants/texts';
import styles from './Footer.scss';

const Footer: React.FunctionComponent = () => {
  const licenseURL = `${repository.url}/blob/master/LICENSE`;
  return (
    <small className={styles.footer}>
      <span className={styles.version}>{displayName} {version}</span>
      <a href={repository.url} target="_blank">{SOURCE_CODE}</a>
      <a href={licenseURL} target="_blank">{LICENSE}</a>
    </small>
  );
};

export default Footer;
