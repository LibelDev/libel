import produce, { immerable } from 'immer';
import defaultTo from 'lodash/defaultTo';
import * as dataSchemas from '../schemas/data';
import * as dataSetSchemas from '../schemas/dataSet';
import { IPost } from '../types/post';
import Data, { IData } from './Data';
import Label, { ILabelDatum } from './Label';

export interface IDataSet {
  data: Data;
}

class DataSet implements IDataSet {
  [immerable] = true;
  data!: Data;

  constructor (dataSet?: IDataSet) {
    this.data = new Data(dataSet?.data);
  }

  static factory (): IDataSet {
    return { data: new Data() };
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
            const text = label;
            return new Label(text);
          }
          const { text, reason, url, date, source } = label;
          return new Label(text, reason, url, date, source);
        });
        return dataSet;
      }, this.factory());
    }
    return { data: new Data(object) };
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
  serialize (): void { };

  add (user: string, text: string, reason: string, source?: IPost) {
    const labels = (this.data[user] || (this.data[user] = []));
    const index = labels.findIndex((label) => label.text === text);
    if (index === -1) {
      const label = new Label(
        text,
        reason,
        window.location.href,
        Date.now(),
        source && {
          thread: source.thread_id,
          page: source.page,
          messageNumber: source.msg_num
        }
      );
      labels.push(label);
    }
    return this;
  }

  edit (user: string, index: number, text: string, reason: string) {
    const labels = this.data[user];
    if (labels && index >= 0) {
      const label = labels[index];
      label.text = defaultTo(text, label.text);
      label.reason = defaultTo(reason, label.reason);
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
