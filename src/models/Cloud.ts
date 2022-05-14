import { TypedEmitter } from 'tiny-typed-emitter';
import * as cloud from '../helpers/cloud';
import { ready } from '../helpers/gapi';
import { selectSync } from '../store/selectors';
import type { TStore } from '../store/store';

export enum SyncEvent {
  Sync = 'sync',
  Success = 'sync:success',
  Error = 'sync:error',
  Finish = 'sync:finish'
}

interface IEvents {
  [SyncEvent.Sync]: () => void;
  [SyncEvent.Success]: () => void;
  [SyncEvent.Error]: (err: unknown) => void;
  [SyncEvent.Finish]: () => void;
}

class Cloud extends TypedEmitter<IEvents> {
  private store: TStore;
  private filename: string;
  private interval: number;
  private timer: number | null = null;

  constructor (store: TStore, filename: string, interval: number) {
    super();
    this.store = store;
    this.filename = filename;
    this.interval = interval;
  }

  private register (auth: gapi.auth2.GoogleAuth) {
    const { interval } = this;
    this.timer = window.setTimeout(() => {
      this.sync(auth);
    }, interval);
    return this.timer;
  }

  private unregister () {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    return this;
  }

  private handleSignIn (signedIn: boolean, auth: gapi.auth2.GoogleAuth) {
    if (!signedIn) {
      this.unregister();
    } else {
      this.sync(auth);
    }
  }

  async sync (auth: gapi.auth2.GoogleAuth) {
    const { store, filename } = this;
    const signedIn = auth?.isSignedIn.get();
    if (signedIn) {
      const state = store.getState();
      const sync = selectSync(state);
      if (!sync.loading) {
        this.unregister();
        this.emit(SyncEvent.Sync);
        try {
          await cloud.sync(filename);
          this.emit(SyncEvent.Success);
        } catch (err) {
          this.emit(SyncEvent.Error, err);
        } finally {
          this.emit(SyncEvent.Finish);
        }
        this.register(auth); // register next sync
      }
    }
  }

  async clear () {
    const { filename } = this;
    await cloud.clear(filename);
    return this;
  }

  async bootstrap () {
    const gapi = await ready();
    const auth = gapi.auth2.getAuthInstance();
    // bind state change handlers
    auth.isSignedIn.listen((signedIn) => {
      this.handleSignIn(signedIn, auth);
    });
    // initial sync
    this.sync(auth);
  }
}

export default Cloud;
