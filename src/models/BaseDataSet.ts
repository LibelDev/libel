import { immerable } from 'immer';
import { getNextLabelID } from '../helpers/label';
import dataSchema from '../schemas/data';
import dataSetSchema from '../schemas/dataSet';
import Data, { IData } from './Data';
import Label, { ILabel, ILabelDatum } from './Label';

export interface ISerializedBaseDataSet {
  data: IData;
}

export interface IBaseDataSet extends ISerializedBaseDataSet { }

class BaseDataSet implements IBaseDataSet {
  [immerable] = true;
  data: Data;

  constructor (baseDataSet?: IBaseDataSet) {
    this.data = new Data(baseDataSet?.data);
  }

  /**
   * turn stale data into latest data structure
   * @param {any} object
   * @returns {IBaseDataSet}
   */
  private static massage (object: IData | ILabelDatum[]): IBaseDataSet {
    if (Array.isArray(object)) {
      return object.reduce<IBaseDataSet>((baseDataSet, datum) => {
        const { data } = baseDataSet;
        const { user, labels } = datum;
        data[user] = labels.map((label) => {
          if (typeof label === 'string') {
            // backward compatible
            const text = label;
            // `id` will be patched later
            return new Label(undefined, text);
          }
          return Label.deserialize(label);
        });
        return baseDataSet;
      }, { data: {} });
    }
    return { data: { ...object } };
  }

  /**
   * validate the given object as custom labels data, massage the object when necessary
   * @param {any} object the object to be validated
   * @returns {IBaseDataSet | null}
   */
  static validate (object: any): IBaseDataSet | null {
    const schemas = [dataSetSchema, dataSchema];
    for (const _schema of schemas) {
      const { value, error } = _schema.validate(object);
      if (!error) {
        if (_schema === dataSetSchema) {
          return value;
        }
        if (_schema === dataSchema) {
          return this.massage(value);
        }
      }
    }
    return null;
  }

  static implements (object: any): object is IBaseDataSet {
    return (
      object instanceof this
      || (
        'data' in object
      )
    );
  }

  static aggregate (dataSet: IBaseDataSet) {
    const { data } = dataSet;
    const users = Object.keys(data);
    const labels = users.reduce<ILabel[]>((labels, user) => {
      const _labels = data[user] || [];
      return labels.concat(_labels);
    }, []);
    return { users, labels };
  }

  aggregate () {
    return BaseDataSet.aggregate(this);
  }

  add (user: string, data: Pick<ILabel, 'text' | 'reason' | 'source' | 'color' | 'image'>) {
    this.data[user] = this.data[user] || [];
    const labels = this.data[user]!;
    const id = getNextLabelID(labels);
    const { text, reason, source, color, image } = data;
    const { href: url } = window.location;
    const date = Date.now();
    const label = new Label(id, text, reason, url, date, source, color, image);
    labels.push(label);
    return this;
  }

  edit (user: string, index: number, data: Pick<ILabel, 'text' | 'reason' | 'color' | 'image'>) {
    const labels = this.data[user];
    if (labels && index >= 0) {
      const labels = this.data[user] || [];
      const target = labels[index];
      const { text, reason = '', color = '', image = '' } = data;
      target.text = text;
      target.reason = reason;
      target.color = color;
      target.image = image;
    }
    return this;
  }

  remove (user: string, index: number) {
    const labels = this.data[user];
    if (labels && index >= 0) {
      labels.splice(index, 1);
      if (labels.length === 0) {
        delete this.data[user];
      }
    }
    return this;
  }

  plain<T extends IBaseDataSet> (): T {
    const json = JSON.stringify(this);
    return JSON.parse(json);
  }

  patch () {
    /** patch Label#id */
    const { data } = this;
    const users = Object.keys(data);
    for (const user of users) {
      const labels = data[user]!;
      for (const label of labels) {
        if (!label.id) {
          const id = getNextLabelID(labels);
          label.id = id;
        }
      }
    }
    return this;
  }
}

export default BaseDataSet;
