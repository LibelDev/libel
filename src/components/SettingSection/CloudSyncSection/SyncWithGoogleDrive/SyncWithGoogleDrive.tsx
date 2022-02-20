import formatRelative from 'date-fns/formatRelative';
import { zhHK } from 'date-fns/locale';
import React, { useCallback, useMemo } from 'react';
import logo from '../../../../../assets/logos/google/google-drive.png';
import * as TEXTS from '../../../../constants/texts';
import useGoogleAuthorization from '../../../../hooks/useGoogleAuthorization';
import { selectMeta, selectSync } from '../../../../store/selectors';
import { useTypedSelector } from '../../../../store/store';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import { IconName } from '../../../../types/icon';
import Icon from '../../../Icon/Icon';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import styles from './SyncWithGoogleDrive.scss';

const SyncWithGoogleDrive: React.FunctionComponent = () => {
  const [auth, user, signedIn] = useGoogleAuthorization();
  const meta = useTypedSelector(selectMeta);
  const sync = useTypedSelector(selectSync);

  const localizedLastSyncedTime = useMemo(() => {
    if (meta.lastSyncedTime) {
      const date = new Date(meta.lastSyncedTime);
      const now = new Date();
      return formatRelative(date, now, { locale: zhHK });
    }
  }, [meta.lastSyncedTime]);

  const handleSignIn: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    if (auth) {
      auth.signIn();
    }
  }, [auth]);

  const handleSignout: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    if (auth) {
      auth.signOut();
    }
  }, [auth]);

  return (
    <React.Fragment>
      <div className={styles.label}>
        <img className={styles.logo} src={logo} alt='' />
        <div className={styles.info}>
          {TEXTS.CLOUD_SYNC_GOOGLE_DRIVE_LABEL_TEXT}
          {
            user && signedIn && (
              <React.Fragment>
                <small className={styles.hint}>
                  <Icon className={styles.icon} icon={IconName.Verified} />
                  {TEXTS.CLOUD_SYNC_GOOGLE_DRIVE_ACCOUNT_PREFIX}{' '}
                  {user.getBasicProfile().getEmail()}
                </small>
                {
                  sync.loading ? (
                    <small className={styles.hint}>
                      <LoadingSpinner className={styles.icon} />
                      {TEXTS.CLOUD_SYNC_SYNC_IN_PROGRESS_LABEL_TEXT}
                    </small>
                  ) : (
                    <React.Fragment>
                      {
                        !!localizedLastSyncedTime && (
                          <small className={styles.hint}>
                            <Icon className={styles.icon} icon={IconName.CloudUpload} />
                            {TEXTS.CLOUD_SYNC_LAST_SYNCED_AT_LABEL_TEXT}{' '}
                            {localizedLastSyncedTime}
                          </small>
                        )
                      }
                      {
                        !!sync.error && (
                          <small className={styles.hint}>
                            <Icon className={styles.icon} icon={IconName.CommentAlert} />
                            {TEXTS.CLOUD_SYNC_ERROR}
                          </small>
                        )
                      }
                    </React.Fragment>
                  )
                }
              </React.Fragment>
            )
          }
        </div>
      </div>
      <a
        href="#"
        role="button"
        className={lihkgCssClasses.settingOptionButton}
        onClick={signedIn ? handleSignout : handleSignIn}
      >
        {
          signedIn ?
            TEXTS.GOOGLE_SIGNOUT_BUTTON_TEXT :
            TEXTS.GOOGLE_AUTHORIZE_BUTTON_TEXT
        }
      </a>
    </React.Fragment>
  );
};

export default SyncWithGoogleDrive;
