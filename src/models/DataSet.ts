import { immerable } from 'immer';
import defaultTo from 'lodash/defaultTo';
import * as dataSchemas from '../schemas/data';
import * as dataSetSchemas from '../schemas/dataSet';
import { IPost } from '../types/post';
import { ILabel, ILabelDatum } from './Label';

export interface IData {
  [user: string]: ILabel[] | undefined;
}

export interface IDataSet {
  data: IData;
}

abstract class DataSet implements IDataSet {
  [immerable] = true;
  data!: IData;

  constructor (data: IData = {}) {
    this.data = data;
  }

  static factory (): IDataSet {
    return { data: {} };
  }

  /**
   * turn stale data into latest data structure
   * @param object {any}
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
            return { text: label };
          }
          return label;
        });
        return dataSet;
      }, this.factory());
    }
    return { data: object };
  }

  /**
   * validate the given object as custom labels data, massage the object when necessary
   * @param object {any} the object to be validated
   * @returns {IDataSet | null}
   */
  static validate (object: any): IDataSet | null {
    const _schemas = [dataSetSchemas.default, dataSchemas.default];
    for (const schema of _schemas) {
      const { value, error } = schema.validate(object);
      if (!error) {
        if (schema === dataSetSchemas.default) {
          return value;
        }
        if (schema === dataSchemas.default) {
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

  /**
   * prepare for storage
   * @abstract
   */
  abstract serialize (): void;

  add (user: string, text: string, reason: string, source?: IPost) {
    const labels = (this.data[user] || (this.data[user] = []));
    const index = labels.findIndex((label) => label.text === text);
    if (index === -1) {
      const label: ILabel = {
        text,
        reason,
        url: window.location.href,
        date: Date.now(),
      };
      if (source) {
        label.source = {
          thread: source.thread_id,
          page: source.page,
          messageNumber: source.msg_num
        };
      }
      labels.push(label);
    }
    return this;
  }

  edit (user: string, index: number, text: string, reason: string) {
    const labels = (this.data[user] || (this.data[user] = []));
    if (index >= 0) {
      const label = labels[index];
      const _label = {
        ...label,
        text: defaultTo(text, label.text),
        reason: defaultTo(reason, label.reason)
      };
      labels.splice(index, 1, _label);
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
}

export default DataSet;
