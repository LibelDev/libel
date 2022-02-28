import Data from './Data';
import DataSet, { IDataSet } from './DataSet';

export interface ISerializedCustom extends IDataSet { }

export interface ICustom extends ISerializedCustom { }

class Custom extends DataSet implements ICustom {
  static factory () {
    const data = new Data();
    const dataSet: IDataSet = { data };
    return new this(dataSet);
  }

  static deserialize (custom: Custom | ISerializedCustom) {
    if (custom instanceof this) {
      return custom;
    }
    return new this(custom);
  }

  serialize (): ISerializedCustom {
    const { data } = this;
    return { data };
  }
}

export default Custom;
