import Data from './Data';
import BaseDataSet, { ISerializedBaseDataSet } from './BaseDataSet';

export interface ISerializedDataSet extends ISerializedBaseDataSet { }

export interface IDataSet extends ISerializedDataSet { }

class DataSet extends BaseDataSet implements IDataSet {
  static factory<T extends DataSet> () {
    const data = new Data();
    const dataSet: IDataSet = { data };
    return new this(dataSet) as T;
  }

  static deserialize<T extends DataSet> (dataSet: DataSet | ISerializedDataSet) {
    if (dataSet instanceof this) {
      return dataSet as T;
    }
    return new this(dataSet) as T;
  }

  serialize (): ISerializedDataSet {
    const { data } = this;
    return { data };
  }
}

export default DataSet;
