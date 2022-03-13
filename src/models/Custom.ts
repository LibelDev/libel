import Data from './Data';
import DataSet, { ISerializedDataSet } from './DataSet';

export interface ISerializedCustom extends ISerializedDataSet { }

export interface ICustom extends ISerializedCustom { }

class Custom extends DataSet implements ICustom {
  static factory<T extends Custom> () {
    const data = new Data();
    const dataSet: ICustom = { data };
    return new this(dataSet) as T;
  }

  static deserialize<T extends Custom> (custom: Custom | ISerializedCustom) {
    if (custom instanceof this) {
      return custom as T;
    }
    return new this(custom) as T;
  }

  serialize (): ISerializedCustom {
    const { data } = this;
    return { data };
  }
}

export default Custom;
