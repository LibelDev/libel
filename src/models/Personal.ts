import DataSet, { IDataSet, ISerializedDataSet } from './DataSet';

export interface ISerializedPersonal extends ISerializedDataSet { }

export interface IPersonal extends IDataSet { }

class Personal extends DataSet implements IPersonal {
  static factory<T extends Personal> () {
    return super.factory<T>();
  }

  static deserialize<T extends Personal> (personal: Personal | ISerializedPersonal) {
    return super.deserialize<T>(personal);
  }

  plain<T extends IPersonal> (): T {
    return super.plain<T>();
  }
}

export default Personal;
