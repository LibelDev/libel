import { Optional } from 'utility-types';
import DataSet from '../models/DataSet';
import Personal, { ISerializedPersonal } from '../models/Personal';
import Subscription, { ISerializedSubscription } from '../models/Subscription';
import storage from '../helpers/storage';
import { defaultSubscriptions } from '../constants/subscriptions';
import * as storageSchemas from '../schemas/storage';

export interface ISerializedStorage {
  personal: ISerializedPersonal;
  subscriptions: ISerializedSubscription[];
}

export type TMassagedStorage = Optional<ISerializedStorage, 'subscriptions'>;

export interface IStorage {
  personal: Personal;
  subscriptions: Subscription[];
}

export function isISerializedStorageImplemented (object: any): object is ISerializedStorage {
  return (
    'personal' in object
    && 'subscriptions' in object
  );
}

class Storage implements IStorage {
  private readonly key!: string;
  personal: Personal = new Personal();
  subscriptions: Subscription[] = [];

  constructor (keys: string[]) {
    this.key = keys[0];
    const json = Storage.load(keys);
    const data = Storage.parse(json);
    this.update(data);
  }

  private static load (keys: string[]) {
    const [, ...fallbackDataKeys] = keys;
    for (const key of keys) {
      const json = storage.getItem(key);
      if (json) {
        if (fallbackDataKeys && fallbackDataKeys.indexOf(key) >= 0) {
          storage.removeItem(key);
        }
        return json;
      }
    }
    return '{}';
  }

  private static parse (json: string) {
    const object = JSON.parse(json);
    const data = this.massage(object);
    data.subscriptions = data.subscriptions || defaultSubscriptions;
    return this.deserialize(data);
  }

  /**
   * turn stale data into latest data structure
   * @param object {any}
   * @returns {TMassagedStorage}
   */
  private static massage (object: any): TMassagedStorage {
    if (isISerializedStorageImplemented(object)) {
      return object;
    }
    const personal = DataSet.validate(object);
    if (personal) {
      return { personal };
    }
    return { personal: DataSet.factory() };
  }

  /**
   * validate the given object as local storage data, massage the object when necessary
   * @param object {any} the object to be validated
   * @returns {TMassagedStorage | null}
   */
  static validate (object: any): TMassagedStorage | null {
    const _schemas = [storageSchemas.default, storageSchemas.deprecated];
    for (const schema of _schemas) {
      const { value, error } = schema.validate(object);
      if (!error) {
        if (schema === storageSchemas.default) {
          return value;
        }
        if (schema === storageSchemas.deprecated) {
          return this.massage(value);
        }
      }
    }
    return null;
  }

  private static serialize (data: IStorage): ISerializedStorage {
    const { personal, subscriptions } = data;
    return {
      personal: personal.serialize(),
      subscriptions: subscriptions ? subscriptions.map((subscription) => subscription.serialize()) : []
    };
  }

  static deserialize (data: TMassagedStorage): IStorage {
    const { personal, subscriptions } = data;
    return {
      personal: new Personal(personal.data),
      subscriptions: subscriptions ? subscriptions.map(({ name, url, enabled }) => new Subscription(name, url, enabled)) : []
    };
  }

  serialize () {
    return Storage.serialize(this);
  }

  is (key: string) {
    return this.key === key;
  }

  json () {
    const data = this.serialize();
    return JSON.stringify(data);
  }

  load () {
    const keys = [this.key];
    const json = Storage.load(keys);
    const data = Storage.parse(json);
    this.update(data);
    return this;
  }

  save () {
    const json = this.json();
    storage.setItem(this.key, json);
    return this;
  }

  update (state: IStorage) {
    const { personal, subscriptions } = state;
    this.personal = personal;
    this.subscriptions = subscriptions;
    return this;
  }
}

export default Storage;
