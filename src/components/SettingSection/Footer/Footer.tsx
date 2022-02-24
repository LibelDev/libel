import { render } from 'mustache';
import React from 'react';
import { displayName, repository, version } from '../../../../package.json';
import { LICENSE, SOURCE_CODE } from '../../../constants/texts';
import { selectPersonal, selectSubscriptions } from '../../../store/selectors';
import { useTypedSelector } from '../../../store/store';
import * as messages from '../../../templates/messages';
import styles from './Footer.module.scss';

const licenseURL = `${repository.url}/blob/master/LICENSE`;

const Footer: React.FunctionComponent = () => {
  const personal = useTypedSelector(selectPersonal);
  const subscriptions = useTypedSelector(selectSubscriptions);
  const { users, labels } = personal.aggregate();
  const stats = render(messages.stats.total, { users, labels, subscriptions });
  return (
    <small className={styles.footer}>
      <div className={styles.stats}>{stats}</div>
      <span className={styles.version}>{displayName} {version}</span>
      <a href={repository.url} target="_blank">{SOURCE_CODE}</a>
      <a href={licenseURL} target="_blank">{LICENSE}</a>
    </small>
  );
};

export default Footer;
