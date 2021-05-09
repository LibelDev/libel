import DataSet, { IDataSet } from './DataSet';

export interface ISerializedPersonal extends IDataSet { }

export interface IPersonal extends ISerializedPersonal { }

class Personal extends DataSet implements IPersonal {
  static deserialize (data: Personal | ISerializedPersonal) {
    if (data instanceof Personal) {
      return data;
    }
    return new Personal(data.data);
  }

  /**
   * prepare for storage
   * @returns {ISerializedPersonal}
   */
  serialize (): ISerializedPersonal {
    const { data } = this;
    return { data };
  }
}

export default Personal;
