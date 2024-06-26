import { baseRemote } from '../../schemas/subscription';
import BaseDataSet, { IBaseDataSet } from '../BaseDataSet';
import type { IBaseSubscription } from './BaseSubscription';

export interface IBaseRemoteSubscription extends IBaseSubscription, IBaseDataSet { }

class BaseRemoteSubscription extends BaseDataSet implements IBaseRemoteSubscription {
  constructor (
    public name: string,
    public version: string,
    public homepage?: string,
    public color?: string
  ) {
    super();
  }

  /**
   * validate the given object as remote subscription
   * @param {any} object the object to be validated
   * @returns {IBaseRemoteSubscription | null}
   */
  static validate (object: any): IBaseRemoteSubscription | null {
    const _schemas = [baseRemote];
    for (const _schema of _schemas) {
      const { value, error } = _schema.validate(object);
      if (!error) {
        if (_schema === baseRemote) {
          return value;
        }
      }
    }
    return null;
  }

  static implements (object: any): object is IBaseRemoteSubscription {
    return (
      object instanceof this
      || (
        super.implements(object)
        && 'name' in object
        && 'version' in object
      )
    );
  }

  serialize () { }
}

export default BaseRemoteSubscription;
