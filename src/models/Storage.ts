import { defaultSubscriptions } from '../constants/subscriptions';
import storage, { localStorage } from '../helpers/storage';
import schema, { deprecated } from '../schemas/storage';
import { initialState as initialConfigState } from '../store/slices/config';
import { initialState as initialMetaState } from '../store/slices/meta';
import DataSet from './DataSet';
import Config, { ISerializedConfig } from './Config';
import Meta, { ISerializedMeta } from './Meta';
import Personal, { ISerializedPersonal } from './Personal';
import Subscription, { ISerializedSubscription } from './Subscription';

export interface ISerializedStorage {
  config?: ISerializedConfig;
  meta?: ISerializedMeta;
  personal: ISerializedPersonal;
  subscriptions: ISerializedSubscription[];
}

export interface IStorage {
  config?: Config;
  meta?: Meta;
  personal: Personal;
  subscriptions: Subscription[];
}

function isISerializedStorageImplemented (object: any): object is ISerializedStorage {
  return (
    'config' in object
    && 'meta' in object
    && 'personal' in object
    && 'subscriptions' in object
  );
}

const _dataKeys = Symbol('dataKeys');
const _configKey = Symbol('configKey');
const _metaKey = Symbol('metaKey');
const _ready = Symbol('ready');

class Storage implements IStorage {
  private readonly [_dataKeys]: string[];
  private readonly [_configKey]: string;
  private readonly [_metaKey]: string;
  private readonly [_ready]: Promise<this>;
  config = initialConfigState;
  meta = initialMetaState;
  personal: Personal = new Personal();
  subscriptions: Subscription[] = [];

  constructor (dataKeys: string[], configKey: string, metaKey: string) {
    this[_dataKeys] = dataKeys;
    this[_configKey] = configKey;
    this[_metaKey] = metaKey;
    this[_ready] = this.load();
  }

  private static clean (keys: string[]) {
    for (const key of keys) {
      storage.removeItem(key);
      localStorage.removeItem(key);
    }
  }

  private static async load (dataKeys: string[], configKey: string, metaKey: string) {
    const [dataKey, ...deprecatedDataKeys] = dataKeys;
    const data = await storage.getItem<string>(dataKey);
    const config = await storage.getItem<string>(configKey);
    const meta = await storage.getItem<string>(metaKey);
    if (data) {
      this.clean(deprecatedDataKeys);
      return this.parse(data, config, meta);
    }
    for (const key of deprecatedDataKeys) {
      const data = await storage.getItem<string>(key);
      if (data) {
        return this.parse(data, config, meta);
      }
    }
    return this.parse('{}');
  }

  /**
   * parse, massage, validate and deserialize the stored data
   * @private
   * @static
   * @param {string} data the data JSON string
   * @param {string} meta the meta JSON string
   */
  private static parse (data: string, config?: string | null, meta?: string | null) {
    const object = JSON.parse(data);
    const { personal, subscriptions } = object;
    const storage = this.massage({
      config: config ? JSON.parse(config) : initialConfigState,
      meta: meta ? JSON.parse(meta) : initialMetaState,
      personal: personal ? JSON.parse(personal) : Personal.factory(),
      subscriptions: subscriptions ? JSON.parse(subscriptions) : defaultSubscriptions
    });
    const _storage = this.validate(storage)!;
    return this.deserialize(_storage);
  }

  /**
   * turn stale data into latest data structure
   * @private
   * @static
   * @param {any} object
   * @returns {ISerializedStorage}
   */
  private static massage (object: any): ISerializedStorage {
    if (isISerializedStorageImplemented(object)) {
      return object;
    }
    const personal = DataSet.validate(object);
    if (personal) {
      return {
        config: initialConfigState,
        meta: initialMetaState,
        personal,
        subscriptions: []
      };
    }
    return {
      config: initialConfigState,
      meta: initialMetaState,
      personal: Personal.factory(),
      subscriptions: []
    };
  }

  /**
   * validate the given object as local storage data, massage the object when necessary
   * @static
   * @param {any} object the object to be validated
   * @returns {ISerializedStorage | null}
   */
  static validate (object: any): ISerializedStorage | null {
    const schemas = [schema, deprecated];
    for (const _schema of schemas) {
      const { value, error } = _schema.validate(object);
      if (!error) {
        if (_schema === schema) {
          return value as ISerializedStorage;
        }
        if (_schema === deprecated) {
          return this.massage(value);
        }
      }
    }
    return null;
  }

  private static serialize (data: IStorage): ISerializedStorage {
    const { config, meta, personal, subscriptions } = data;
    return {
      config: config?.serialize(),
      meta: meta?.serialize(),
      personal: personal.serialize(),
      subscriptions: subscriptions.map((subscription) => subscription.serialize())
    };
  }

  static deserialize (storage: IStorage | ISerializedStorage): IStorage {
    const { config, meta, personal, subscriptions } = storage;
    return {
      config: config && Config.deserialize(config),
      meta: meta && Meta.deserialize(meta),
      personal: Personal.deserialize(personal),
      subscriptions: subscriptions.map(Subscription.deserialize)
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

  /**
   * load the storage into the model
   * @async
   * @returns {Promise<this>}
   */
  async load (): Promise<this> {
    const dataKeys = this[_dataKeys];
    const configKey = this[_configKey];
    const metaKey = this[_metaKey];
    const storage = await Storage.load(dataKeys, configKey, metaKey);
    this.update(storage);
    return this;
  }

  update (storage: IStorage | ISerializedStorage) {
    // always deserialize the storage
    const { config, meta, personal, subscriptions } = Storage.deserialize(storage);
    this.config = config || this.config;
    this.meta = meta || this.meta;
    this.personal = personal;
    this.subscriptions = subscriptions;
    return this;
  }
}

export default Storage;
