import DataSet, { IDataSet } from './DataSet';

export interface ISerializedPersonal extends IDataSet { }

export interface IPersonal extends ISerializedPersonal { }

class Personal extends DataSet implements IPersonal {
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
