import { immerable } from 'immer';
import { getNextLabelID } from '../helpers/label';
import dataSchema from '../schemas/data';
import dataSetSchema from '../schemas/dataSet';
import Data, { IData } from './Data';
import Label, { ILabel, ILabelDatum } from './Label';

export interface ISerializedDataSet {
  data: IData;
}

export interface IDataSet extends ISerializedDataSet { }

abstract class DataSet implements IDataSet {
  [immerable] = true;
  data: Data;

  constructor (dataSet?: IDataSet) {
    this.data = new Data(dataSet?.data);
  }

  /**
   * turn stale data into latest data structure
   * @param {any} object
   * @returns {IDataSet}
   */
  private static massage (object: IData | ILabelDatum[]): IDataSet {
    if (Array.isArray(object)) {
      return object.reduce<IDataSet>((dataSet, datum) => {
        const { data } = dataSet;
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
        return dataSet;
      }, { data: {} });
    }
    return { data: { ...object } };
  }

  /**
   * validate the given object as custom labels data, massage the object when necessary
   * @param {any} object the object to be validated
   * @returns {IDataSet | null}
   */
  static validate (object: any): IDataSet | null {
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

  static implements (object: any): object is IDataSet {
    return (
      object instanceof this
      || (
        'data' in object
      )
    );
  }

  static aggregate (dataSet: IDataSet) {
    const { data } = dataSet;
    const users = Object.keys(data);
    const labels = users.reduce<ILabel[]>((labels, user) => {
      const _labels = data[user] || [];
      return labels.concat(_labels);
    }, []);
    return { users, labels };
  }

  abstract serialize (): unknown;

  aggregate () {
    return DataSet.aggregate(this);
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

  plain<T extends IDataSet> (): T {
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

export default DataSet;
