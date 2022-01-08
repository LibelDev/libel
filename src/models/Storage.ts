import { defaultSubscriptions } from '../constants/subscriptions';
import storage, { localStorage } from '../helpers/storage';
import schema, { deprecated } from '../schemas/storage';
import { initialState as initialMetaState } from '../store/slices/meta';
import DataSet from './DataSet';
import Meta, { ISerializedMeta } from './Meta';
import Personal, { ISerializedPersonal } from './Personal';
import Subscription, { ISerializedSubscription } from './Subscription';

export interface ISerializedStorage {
  personal: ISerializedPersonal;
  subscriptions: ISerializedSubscription[];
  meta?: ISerializedMeta;
}

export interface IStorage {
  personal: Personal;
  subscriptions: Subscription[];
  meta?: Meta;
}

function isISerializedStorageImplemented (object: any): object is ISerializedStorage {
  return (
    'personal' in object
    && 'subscriptions' in object
    && 'meta' in object
  );
}

const _dataKeys = Symbol('dataKeys');
const _metaKey = Symbol('metaKey');
const _ready = Symbol('ready');

class Storage implements IStorage {
  private readonly [_dataKeys]!: string[];
  private readonly [_metaKey]!: string;
  private readonly [_ready]!: Promise<this>;
  personal: Personal = new Personal();
  subscriptions: Subscription[] = [];
  meta: Meta = initialMetaState;

  constructor (dataKeys: string[], metaKey: string) {
    this[_dataKeys] = dataKeys;
    this[_metaKey] = metaKey;
    this[_ready] = this.load();
  }

  private static clean (keys: string[]) {
    for (const key of keys) {
      storage.removeItem(key);
      localStorage.removeItem(key);
    }
  }

  private static async load (dataKeys: string[], metaKey: string) {
    const [dataKey, ...deprecatedDataKeys] = dataKeys;
    const data = await storage.getItem<string>(dataKey);
    const meta = await storage.getItem<string>(metaKey);
    if (data) {
      this.clean(deprecatedDataKeys);
      return this.parse(data, meta);
    }
    for (const key of deprecatedDataKeys) {
      const data = await storage.getItem<string>(key);
      if (data) {
        return this.parse(data, meta);
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
  private static parse (data: string, meta?: string | null) {
    const object = JSON.parse(data);
    const { personal, subscriptions } = object;
    const storage = this.massage({
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
        meta: initialMetaState,
        personal,
        subscriptions: []
      };
    }
    return {
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
    const { meta, personal, subscriptions } = data;
    return {
      meta: meta?.serialize(),
      personal: personal.serialize(),
      subscriptions: subscriptions.map((subscription) => subscription.serialize())
    };
  }

  static deserialize (storage: IStorage | ISerializedStorage): IStorage {
    const { meta, personal, subscriptions } = storage;
    return {
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
    const metaKey = this[_metaKey];
    const storage = await Storage.load(dataKeys, metaKey);
    this.update(storage);
    return this;
  }

  update (storage: IStorage | ISerializedStorage) {
    // always deserialize the storage
    const { meta, personal, subscriptions } = Storage.deserialize(storage);
    this.meta = meta || this.meta;
    this.personal = personal;
    this.subscriptions = subscriptions;
    return this;
  }
}

export default Storage;
