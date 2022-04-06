import { render } from 'mustache';
import React from 'react';
import { displayName, repository, version } from '../../../../package.json';
import { BUTTON_TEXT_LICENSE, BUTTON_TEXT_SOURCE_CODE } from '../../../constants/texts';
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
      {stats}
      <div className={styles.info}>
        <span>{displayName} {version}</span>
        <span>
          <a href={repository.url} target="_blank">{BUTTON_TEXT_SOURCE_CODE}</a>
          <a href={licenseURL} target="_blank">{BUTTON_TEXT_LICENSE}</a>
        </span>
      </div>
    </small>
  );
};

export default Footer;
