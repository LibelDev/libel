import { useCallback, useEffect, useState } from 'react';
import * as TEXTS from '../constants/texts';
import { ready } from '../helpers/gapi';
import * as gtag from '../helpers/gtag';
import * as LIHKG from '../helpers/lihkg';
import { EventAction, EventCategory } from '../types/ga';

module UseGoogleAuthorization {
  /**
   * `useGoogleAuthorization` hook result
   */
  export type TResult = [
    gapi.auth2.GoogleAuth | undefined,
    gapi.auth2.GoogleUser | undefined,
    (options?: gapi.auth2.SigninOptions | gapi.auth2.SigninOptionsBuilder) => Promise<gapi.auth2.GoogleUser | undefined>,
    () => void,
    boolean
  ];
}

const useGoogleAuthorization = (): UseGoogleAuthorization.TResult => {
  const [auth, setAuth] = useState<gapi.auth2.GoogleAuth>();
  const [user, setUser] = useState<gapi.auth2.GoogleUser>();
  const [signedIn, setSignedIn] = useState(false);

  const signIn = useCallback(async (options?: gapi.auth2.SigninOptions | gapi.auth2.SigninOptionsBuilder) => {
    try {
      if (auth) {
        const user = await auth.signIn(options);
        const notification = LIHKG.createLocalNotification(TEXTS.CLOUD_SYNC_MESSAGE_GOOGLE_DRIVE_SIGNIN_SUCCESS);
        LIHKG.showNotification(notification);
        return user;
      }
    } catch (err) {
      const notification = LIHKG.createLocalNotification(TEXTS.CLOUD_SYNC_MESSAGE_GOOGLE_DRIVE_SIGNIN_FAILED);
      LIHKG.showNotification(notification);
    }
  }, [auth]);

  const signOut = useCallback(() => {
    if (auth) {
      auth.signOut();
      const notification = LIHKG.createLocalNotification(TEXTS.CLOUD_SYNC_MESSAGE_GOOGLE_DRIVE_SIGNOUT_SUCCESS);
      LIHKG.showNotification(notification);
    }
  }, [auth]);

  useEffect(() => {
    (async () => {
      const gapi = await ready();
      const auth = gapi.auth2.getAuthInstance();
      setAuth(auth);
      // initial state
      const signedIn = auth.isSignedIn.get();
      setSignedIn(signedIn);
      const user = auth.currentUser.get();
      setUser(user);
    })();
  }, []);

  useEffect(() => {
    if (auth) {
      // bind state change handlers
      auth.isSignedIn.listen((signedIn) => {
        setSignedIn(signedIn);
        // analytics
        if (signedIn) {
          gtag.event(EventAction.SignIn, { event_label: EventCategory.Google });
        } else {
          gtag.event(EventAction.SignOut, { event_label: EventCategory.Google });
        }
      });
      auth.currentUser.listen(setUser);
    }
  }, [auth]);

  return [auth, user, signIn, signOut, signedIn];
};

export default useGoogleAuthorization;
