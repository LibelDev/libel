import DataSet, { IDataSet } from './DataSet';

export interface ISerializedPersonal extends IDataSet { }

export interface IPersonal extends ISerializedPersonal { }

class Personal extends DataSet implements IPersonal {
  static deserialize (personal: Personal | ISerializedPersonal) {
    if (personal instanceof Personal) {
      return personal;
    }
    return new Personal(personal);
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
