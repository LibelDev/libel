import RemoteSubscription, { IRemoteSubscription } from './RemoteSubscription';
import type { ISerializedSubscription } from './SerializedSubscription';

export interface ISubscription extends ISerializedSubscription, IRemoteSubscription {
  loaded: boolean;
  loading: boolean;
  error?: string;
}

class Subscription extends RemoteSubscription implements ISubscription {
  enabled: boolean;
  /* state */
  loaded = false;
  loading = false;
  error?: string;

  constructor (name: string, version: string, url: string, enabled: boolean) {
    super(name, version, url);
    this.enabled = enabled;
  }

  static implements (object: any): object is ISubscription {
    return (
      object instanceof this
      || (
        super.implements(object)
        && 'enabled' in object
        && 'loaded' in object
        && 'loading' in object
      )
    );
  }

  static deserialize (subscription: Subscription | ISerializedSubscription) {
    if (subscription instanceof Subscription) {
      return subscription;
    }
    const { name, version, url, enabled } = subscription;
    return new Subscription(name, version, url, enabled);
  }

  serialize () {
    const { name, version, url, enabled } = this;
    return { name, version, url, enabled };
  }

  // enable () {
  //   this.enabled = true;
  //   return this;
  // }

  // disable () {
  //   this.enabled = false;
  //   return this;
  // }
}

export default Subscription;
