import DataSet, { IDataSet } from './DataSet';
import * as subscriptionSchemas from '../schemas/subscription';

export interface ISerializedSubscription {
  name: string;
  readonly url: string;
  enabled: boolean;
}

export interface IRemoteSubscription extends IDataSet, Pick<ISerializedSubscription, 'name'> {
  version: string;
  homepage?: string;
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

  static deserialize (data: Subscription | ISerializedSubscription) {
    if (data instanceof Subscription) {
      return data;
    }
    const { name, url, enabled } = data;
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
}

export default Subscription;
