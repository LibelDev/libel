import { Optional } from 'utility-types';
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

const _keys = Symbol('keys');
const _ready = Symbol('ready');

class Storage implements IStorage {
  private readonly [_keys]!: string[];
  private readonly [_ready]!: Promise<this>;
  personal: Personal = new Personal();
  subscriptions: Subscription[] = [];

  constructor (keys: string[]) {
    this[_keys] = keys;
    this[_ready] = this.load();
  }

  private static clean (keys: string[]) {
    for (const key of keys) {
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
      subscriptions: subscriptions ? JSON.parse(subscriptions) : defaultSubscriptions
    });
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
    return this[_ready];
  }

  serialize () {
    return Storage.serialize(this);
  }

  json () {
    const data = this.serialize();
    return JSON.stringify(data);
  }

  async load () {
    const keys = [this[_keys][0]];
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
}

export default Storage;
