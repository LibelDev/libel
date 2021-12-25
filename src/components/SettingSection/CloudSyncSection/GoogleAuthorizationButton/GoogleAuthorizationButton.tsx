import React, { useCallback, useEffect, useState } from 'react';
import logo from '../../../../../assets/logos/google/google-drive.png';
import * as TEXTS from '../../../../constants/texts';
import { ready } from '../../../../helpers/gapi';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import { IconName } from '../../../../types/icon';
import Icon from '../../../Icon/Icon';
import styles from './GoogleAuthorizationButton.scss';

interface IBasicProfile {
  getId (): string;
  getName (): string;
  getGivenName (): string;
  getFamilyName (): string;
  getImageUrl (): string;
  getEmail (): string;
}

interface IGoogleUser {
  getBasicProfile (): IBasicProfile;
}

const GoogleAuthorizationButton: React.FunctionComponent = () => {
  const [user, setUser] = useState<IGoogleUser | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  const handleSignIn: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    const gapi = await ready();
    const auth = gapi.auth2.getAuthInstance();
    auth.signIn();
  }, []);

  const handleSignout: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    const gapi = await ready();
    const auth = gapi.auth2.getAuthInstance();
    auth.signOut();
  }, []);

  useEffect(() => {
    (async () => {
      const gapi = await ready();
      const auth = gapi.auth2.getAuthInstance();
      // bind state change handlers
      auth.isSignedIn.listen(setSignedIn);
      auth.currentUser.listen(setUser);
      // initial state
      const signedIn = auth.isSignedIn.get();
      setSignedIn(signedIn);
      const user = auth.currentUser.get();
      setUser(user);
    })();
  }, []);

  return (
    <React.Fragment>
      <div className={styles.label}>
        <img className={styles.logo} src={logo} alt='' />
        <div className={styles.provider}>
          {TEXTS.CLOUD_SYNC_GOOGLE_DRIVE_LABEL_TEXT}
          {
            signedIn && user && (
              <small className={styles.user}>
                <Icon className={styles.icon} icon={IconName.Verified} />
                {TEXTS.CLOUD_SYNC_GOOGLE_DRIVE_ACCOUNT_PREFIX}{' '}
                {user.getBasicProfile().getEmail()}
              </small>
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

export default GoogleAuthorizationButton;
