import React, { useCallback, useState } from 'react';
import { displayName } from '../../../../package.json';
import * as TEXTS from '../../../constants/texts';
import * as cloud from '../../../helpers/cloud';
import useGoogleAuthorization from '../../../hooks/useGoogleAuthorization';
import Storage from '../../../models/Storage';
import { selectSync } from '../../../store/selectors';
import { actions as metaActions } from '../../../store/slices/meta';
import { loadDataIntoStore, useTypedDispatch, useTypedSelector } from '../../../store/store';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import Icon from '../../Icon/Icon';
import { IconName } from '../../Icon/types';
import SettingOptionButton, { Variant as SettingOptionButtonVariant } from '../SettingOptionButton/SettingOptionButton';
import styles from './ClearDataSection.module.scss';

interface IProps { }

type TProps = IProps;

const confirm = (question: string, confirmation: string) => {
  const yes = window.confirm(question);
  if (yes) {
    const value = window.prompt(confirmation);
    return value === displayName;
  }
  return false;
};

const ClearDataSection: React.FunctionComponent<TProps> = () => {
  const dispatch = useTypedDispatch();
  const { loading: syncLoading } = useTypedSelector(selectSync);
  const [clearCloudDataLoading, setClearCloudDataLoading] = useState(false);
  const [, , signedIn] = useGoogleAuthorization();

  const handleClearLocalData: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    const sure = confirm(TEXTS.CLEAR_LOCAL_DATA_MESSAGE_CLEAR_CONFIRMATION, TEXTS.CLEAR_LOCAL_DATA_MESSAGE_CLEAR_DOUBLE_CONFIRMATION);
    if (sure) {
      const storage = Storage.factory();
      await loadDataIntoStore(storage);
      window.alert(TEXTS.CLEAR_LOCAL_DATA_MESSAGE_CLEAR_SUCCESS);
    } else {
      // window.alert(TEXTS.CLEAR_LOCAL_DATA_CANCEL);
    }
  }, []);

  const handleClearCloudData: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    const sure = confirm(TEXTS.CLEAR_CLOUD_DATA_MESSAGE_CLEAR_CONFIRMATION, TEXTS.CLEAR_CLOUD_DATA_MESSAGE_CLEAR_DOUBLE_CONFIRMATION);
    if (sure) {
      setClearCloudDataLoading(true);
      await cloud.clear();
      dispatch(metaActions.setLastSyncedTime(null));
      window.alert(TEXTS.CLEAR_CLOUD_DATA_MESSAGE_CLEAR_SUCCESS);
      setClearCloudDataLoading(false);
    } else {
      // window.alert(TEXTS.CLEAR_CLOUD_DATA_CANCEL);
    }
  }, []);

  return (
    <React.Fragment>
      <small className={lihkgCssClasses.settingSectionTitle}>
        {TEXTS.SETTINGS_SECTION_TITLE_CLEAR_DATA}
      </small>
      <ul className={lihkgCssClasses.settingOptionsList}>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <SettingOptionButton
            variant={SettingOptionButtonVariant.Warning}
            className={styles.clearDataButton}
            onClick={handleClearLocalData}
          >
            <Icon className={styles.icon} icon={IconName.Desktop} />
            {TEXTS.BUTTON_TEXT_CLEAR_LOCAL_DATA}
          </SettingOptionButton>
        </li>
        {
          signedIn && (
            <li className={lihkgCssClasses.settingOptionsItem}>
              <SettingOptionButton
                disabled={syncLoading || clearCloudDataLoading}
                variant={SettingOptionButtonVariant.Warning}
                className={styles.clearDataButton}
                onClick={handleClearCloudData}
              >
                <Icon className={styles.icon} icon={IconName.CloudUpload} />
                {TEXTS.BUTTON_TEXT_CLEAR_CLOUD_DATA}
              </SettingOptionButton>
            </li>
          )
        }
      </ul>
    </React.Fragment>
  );
};

export default ClearDataSection;
