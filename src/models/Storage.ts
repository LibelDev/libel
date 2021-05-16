import { Optional } from 'utility-types';
import { deprecatedLocalStorageKeys } from '../constants/storage';
import { defaultSubscriptions } from '../constants/subscriptions';
import storage, { localStorage } from '../helpers/storage';
import DataSet from '../models/DataSet';
import Personal, { ISerializedPersonal } from '../models/Personal';
import Subscription, { ISerializedSubscription } from '../models/Subscription';
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

const key = Symbol('key');
const ready = Symbol('ready');

class Storage implements IStorage {
  private readonly [key]!: string;
  private readonly [ready]!: Promise<this>;
  personal: Personal = new Personal();
  subscriptions: Subscription[] = [];

  constructor (keys: string[]) {
    this[key] = keys[0];
    this[ready] = this.load();
  }

  private static clean (keys: string[]) {
    for (const key of deprecatedLocalStorageKeys) {
      storage.removeItem(key);
      localStorage.removeItem(key);
    }
  }

  private static async load (keys: string[]) {
    const [, ...fallbackDataKeys] = keys;
    for (const key of keys) {
      const json = await storage.getItem<string>(key);
      if (json) {
        this.clean(fallbackDataKeys);
        return json;
      }
    }
    return '{}';
  }

  private static parse (json: string) {
    const object = JSON.parse(json);
    const { personal, subscriptions } = object;
    const data = this.massage({
      personal: personal ? JSON.parse(personal) : Personal.factory(),
      subscriptions: subscriptions ? JSON.parse(subscriptions) : []
    });
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
    return { personal: Personal.factory() };
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

  static serialize (data: IStorage): ISerializedStorage {
    const { personal, subscriptions } = data;
    return {
      personal: personal.serialize(),
      subscriptions: subscriptions ? subscriptions.map((subscription) => subscription.serialize()) : []
    };
  }

  static deserialize (storage: TMassagedStorage): IStorage {
    const { personal, subscriptions } = storage;
    return {
      personal: Personal.deserialize(personal),
      subscriptions: subscriptions ? subscriptions.map(Subscription.deserialize) : []
    };
  }

  ready () {
    return this[ready];
  }

  serialize () {
    return Storage.serialize(this);
  }

  json () {
    const data = this.serialize();
    return JSON.stringify(data);
  }

  private async load () {
    const keys = [this[key]];
    const json = await Storage.load(keys);
    const data = Storage.parse(json);
    this.update(data);
    return this;
  }

  private update (data: IStorage) {
    const { personal, subscriptions } = data;
    this.personal = personal;
    this.subscriptions = subscriptions;
    return this;
  }

  // private async save () {
  //   const data = this.serialize();
  //   await storage.setItem(this[key], data);
  //   return this;
  // }
}

export default Storage;
