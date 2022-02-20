import Data from './Data';
import DataSet, { IDataSet } from './DataSet';

export interface ISerializedPersonal extends IDataSet { }

export interface IPersonal extends ISerializedPersonal { }

class Personal extends DataSet implements IPersonal {
  static factory () {
    const data = new Data();
    const dataSet = { data };
    return new Personal(dataSet);
  }

  static deserialize (personal: Personal | ISerializedPersonal) {
    if (personal instanceof Personal) {
      return personal;
    }
    return new Personal(personal);
  }

  serialize (): ISerializedPersonal {
    const { data } = this;
    return { data };
  }
}

export default Personal;
