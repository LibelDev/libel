import Data from '../Data';
import BaseRemoteSubscription, { IBaseRemoteSubscription } from './BaseRemoteSubscription';

export interface IRemoteSubscription extends IBaseRemoteSubscription {
  readonly url: string;
}

class RemoteSubscription extends BaseRemoteSubscription implements IRemoteSubscription {
  constructor (
    name: string,
    version: string,
    public readonly url: string
  ) {
    super(name, version);
  }

  static implements (object: any): object is IRemoteSubscription {
    return (
      object instanceof this
      || (
        super.implements(object)
        && 'url' in object
      )
    );
  }

  async fetch () {
    const { url } = this;
    const response = await fetch(url);
    const object = await response.json();
    const subscription = RemoteSubscription.validate(object);
    return subscription;
  }

  update (subscription: IBaseRemoteSubscription) {
    this.data = new Data(subscription.data);
    this.name = subscription.name;
    this.version = subscription.version;
    this.homepage = subscription.homepage;
    this.color = subscription.color;
    return this;
  }
}

export default RemoteSubscription;
