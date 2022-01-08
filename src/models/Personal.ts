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
   */
  static serialize (personal: Personal | ISerializedPersonal) {
    if (personal instanceof Personal) {
      const { data } = personal;
      return { data };
    }
    return personal;
  }

  serialize () {
    return Personal.serialize(this);
  }
}

export default Personal;
