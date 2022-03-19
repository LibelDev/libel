import { useEffect, useState } from 'react';
import { EventAction, EventCategory } from '../constants/ga';
import { ready } from '../helpers/gapi';
import * as gtag from './../helpers/gtag';

type TState = [
  gapi.auth2.GoogleAuth | undefined,
  gapi.auth2.GoogleUser | undefined,
  boolean
];

const useGoogleAuthorization = (): TState => {
  const [auth, setAuth] = useState<gapi.auth2.GoogleAuth>();
  const [user, setUser] = useState<gapi.auth2.GoogleUser>();
  const [signedIn, setSignedIn] = useState(false);

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

  return [auth, user, signedIn];
};

export default useGoogleAuthorization;
