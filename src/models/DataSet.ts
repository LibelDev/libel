import { immerable, isDraft, original } from 'immer';
import dataSchema from '../schemas/data';
import dataSetSchema from '../schemas/dataSet';
import Data, { IData } from './Data';
import Label, { ILabel, ILabelDatum } from './Label';

export interface IDataSet {
  data: IData;
}

abstract class DataSet implements IDataSet {
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
            return new Label(text);
          }
          const { text, reason, url, date, source, image } = label;
          return new Label(text, reason, url, date, source, image);
        });
        return dataSet;
      }, this.factory());
    }
    return { data: new Data(object) };
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
    const labels = users.reduce<Label[]>((labels, user) => {
      const _labels = data[user] || [];
      labels = labels.concat(_labels);
      return labels;
    }, []);
    return { users, labels };
  }

  /**
   * prepare for storage
   * @abstract
   */
  abstract serialize (): void;

  aggregate () {
    return DataSet.aggregate(this);
  }

  add (user: string, data: Pick<ILabel, 'text' | 'reason' | 'source' | 'color' | 'image'>) {
    this.data[user] = this.data[user] || [];
    const labels = this.data[user]!;
    const { text, reason, source, color, image } = data;
    const { href: url } = window.location;
    const date = Date.now();
    const label = new Label(text, reason, url, date, source, color, image);
    labels.push(label);
    return this;
  }

  edit (user: string, label: Label, data: Pick<ILabel, 'text' | 'reason' | 'color' | 'image'>) {
    const _this = isDraft(this) ? original(this)! : this; // always use the original `this` for reference checking 
    const labels = _this.data[user] || [];
    const index = labels.indexOf(label);
    if (index >= 0) {
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

  remove (user: string, label: Label) {
    const _this = isDraft(this) ? original(this)! : this; // always use the original `this` for reference checking 
    const labels = _this.data[user] || [];
    const index = labels.indexOf(label);
    if (index >= 0) {
      const labels = this.data[user] || [];
      labels.splice(index, 1);
      if (labels.length === 0) {
        delete this.data[user];
      }
    }
    return this;
  }
}

export default DataSet;
