import * as subscriptionSchemas from '../schemas/subscription';
import Data from './Data';
import DataSet, { IDataSet } from './DataSet';

export interface ISerializedSubscription {
  name: string;
  readonly url: string;
  enabled: boolean;
}

export interface ISubscriptionTemplate extends Pick<ISerializedSubscription, 'name'> {
  version: string;
  homepage?: string;
  color?: string;
}

export interface IRemoteSubscription extends IDataSet, ISubscriptionTemplate { }

export interface ISubscription extends ISerializedSubscription, IRemoteSubscription {
  loaded: boolean;
  loading: boolean;
  error?: string;
}

class Subscription extends DataSet implements ISubscription {
  // base
  name: string;
  readonly url: string;
  enabled: boolean;
  // remote
  version!: string;
  homepage?: string;
  color?: string;
  // state
  loaded: boolean = false;
  loading: boolean = false;
  error?: string;

  constructor (name: string, url: string, enabled: boolean) {
    super();
    this.name = name;
    this.url = url;
    this.enabled = enabled;
  }

  /**
   * validate the given object as remote subscription
   * @param {any} object the object to be validated
   * @returns {IRemoteSubscription | null}
   */
  static validate (object: any): IRemoteSubscription | null {
    const schemas = [subscriptionSchemas.remote];
    for (const _schema of schemas) {
      const { value, error } = _schema.validate(object);
      if (!error) {
        if (_schema === subscriptionSchemas.remote) {
          return value as IRemoteSubscription;
        }
      }
    }
    return null;
  }

  static implements (object: any): object is ISerializedSubscription & IRemoteSubscription {
    return (
      object instanceof this
      || (
        super.implements(object)
        && 'url' in object
        && 'enabled' in object
        && 'name' in object
        && 'version' in object
      )
    );
  }

  static deserialize (subscription: Subscription | ISerializedSubscription) {
    if (subscription instanceof Subscription) {
      return subscription;
    }
    const { name, url, enabled } = subscription;
    return new Subscription(name, url, enabled);
  }

  serialize (): ISerializedSubscription {
    const { url, enabled, name } = this;
    return { url, enabled, name };
  }

  enable () {
    this.enabled = true;
    return this;
  }

  disable () {
    this.enabled = false;
    return this;
  }

  async fetch () {
    const response = await fetch(this.url);
    const object = await response.json();
    const subscription = Subscription.validate(object);
    return subscription;
  }

  update (subscription: IRemoteSubscription) {
    this.data = new Data(subscription.data);
    this.name = subscription.name;
    this.version = subscription.version;
    this.homepage = subscription.homepage;
    this.color = subscription.color;
    return this;
  }
}

export default Subscription;
