import { interval } from './constants/sync';
import * as cloud from './helpers/cloud';
import { ready } from './helpers/gapi';
import { selectSync } from './store/selectors';
import store, { TRootState } from './store/store';

let unregister: (() => void) | null = null;

const sync = async (auth: gapi.auth2.GoogleAuth) => {
  const signedIn = auth.isSignedIn.get();
  if (signedIn) {
    const state = store.getState() as TRootState;
    const sync = selectSync(state);
    if (!sync.loading) {
      await cloud.sync();
      unregister = register(auth); // register next sync
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
