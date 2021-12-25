import React from 'react';
import * as TEXTS from '../../../constants/texts';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.scss';
import GoogleAuthorizationButton from './GoogleAuthorizationButton/GoogleAuthorizationButton';

interface IProps { }

type TProps = IProps;

const CloudSyncSection: React.FunctionComponent<TProps> = () => {
  return (
    <React.Fragment>
      <small className={lihkgCssClasses.settingSectionTitle}>
        {TEXTS.SETTING_CLOUD_SYNC_SECTION_TITLE}
      </small>
      <ul className={lihkgCssClasses.settingOptionsList}>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <GoogleAuthorizationButton />
        </li>
      </ul>
    </React.Fragment>
  );
};

export default CloudSyncSection;
