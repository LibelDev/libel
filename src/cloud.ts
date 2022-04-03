import { EventAction, EventCategory } from './constants/ga';
import { interval } from './constants/sync';
import * as cloud from './helpers/cloud';
import { ready } from './helpers/gapi';
import * as gtag from './helpers/gtag';
import { selectSync } from './store/selectors';
import store from './store/store';

let unregister: (() => void) | null = null;

export const sync = async (auth: gapi.auth2.GoogleAuth) => {
  const signedIn = auth.isSignedIn.get();
  if (signedIn) {
    const state = store.getState();
    const sync = selectSync(state);
    if (!sync.loading) {
      if (unregister) {
        unregister();
      }
      await cloud.sync();
      unregister = register(auth); // register next sync
      // analytics
      gtag.event(EventAction.CloudSync, { event_category: EventCategory.Google });
    }
  }
};

const register = (auth: gapi.auth2.GoogleAuth) => {
  const id = setTimeout(() => sync(auth), interval);
  return () => {
    clearTimeout(id);
    unregister = null;
  };
};

export const bootstrap = async () => {
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
};
