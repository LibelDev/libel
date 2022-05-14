// import debugFactory from 'debug';
import type React from 'react';
import * as TEXTS from '../../../constants/texts';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import ConvertBlockedUsersButton from './ConvertBlockedUsersButton';
import EditDataSetButton from './EditDataSetButton';
import ExportFileButton from './ExportFileButton';
import ImportFileButton from './ImportFileButton';
import MakeSubscriptionButton from './MakeSubscriptionButton';

// const debug = debugFactory('libel:component:ManageDataSection');

const ManageDataSection: React.FunctionComponent = () => {
  return (
    <>
      <small className={lihkgCssClasses.settingSectionTitle}>
        {TEXTS.SETTINGS_TITLE_MANAGE_DATA}
      </small>
      <ul className={lihkgCssClasses.settingOptionsList}>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <EditDataSetButton />
        </li>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <ConvertBlockedUsersButton />
        </li>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <MakeSubscriptionButton />
        </li>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <ExportFileButton />
        </li>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <ImportFileButton />
        </li>
      </ul>
    </>
  );
};

ManageDataSection.displayName = 'ManageDataSection';

export default ManageDataSection;
