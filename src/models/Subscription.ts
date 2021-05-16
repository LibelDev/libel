import * as subscriptionSchemas from '../schemas/subscription';
import Data from './Data';
import DataSet, { IDataSet } from './DataSet';

export interface ISerializedSubscription {
  name: string;
  readonly url: string;
  enabled: boolean;
}

export interface IRemoteSubscription extends IDataSet, Pick<ISerializedSubscription, 'name'> {
  version: string;
  homepage?: string;
  color?: string;
}

export interface ISubscription extends ISerializedSubscription, IRemoteSubscription {
  loading: boolean;
  error?: string;
}

class Subscription extends DataSet implements ISubscription {
  name!: string;
  readonly url!: string;
  enabled!: boolean;
  version!: string;
  homepage?: string;
  color?: string;
  loading: boolean = false;
  error?: string;

  constructor (name: string, url: string, enabled: boolean) {
    super();
    this.name = name;
    this.enabled = enabled;
    this.url = url;
  }

  /**
   * validate the given object as remote subscription
   * @param object {any} the object to be validated
   * @returns {IRemoteSubscription | null}
   */
  static validate (object: any): IRemoteSubscription | null {
    const _schemas = [subscriptionSchemas.remote];
    for (const schema of _schemas) {
      const { value, error } = schema.validate(object);
      if (!error) {
        if (schema === subscriptionSchemas.remote) {
          return value;
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

  /**
   * prepare for storage
   * @returns {ISerializedSubscription}
   */
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
