import { EventName } from './constants/ga';
import { interval } from './constants/sync';
import * as cloud from './helpers/cloud';
import { ready } from './helpers/gapi';
import * as gtag from './helpers/gtag';
import { selectSync } from './store/selectors';
import store from './store/store';

let unregister: (() => void) | null = null;

const sync = async (auth: gapi.auth2.GoogleAuth) => {
  const signedIn = auth.isSignedIn.get();
  if (signedIn) {
    const state = store.getState();
    const sync = selectSync(state);
    if (!sync.loading) {
      await cloud.sync();
      unregister = register(auth); // register next sync
      gtag.event(EventName.CloudSync);
    }
  }
};

const register = (auth: gapi.auth2.GoogleAuth) => {
  const timer = setTimeout(async () => {
    await sync(auth);
  }, interval);
  return () => {
    clearTimeout(timer);
    unregister = null;
  };
};

(async () => {
  const gapi = await ready();
  const auth = gapi.auth2.getAuthInstance();
  // bind state change handlers
  auth.isSignedIn.listen((signedIn) => {
    if (!signedIn) {
      if (unregister) {
        unregister();
      }
    } else {
      sync(auth);
    }
  });
  // initial sync
  sync(auth);
})();
