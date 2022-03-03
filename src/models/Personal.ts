import Custom, { ICustom, ISerializedCustom } from './Custom';

export interface ISerializedPersonal extends ISerializedCustom { }

export interface IPersonal extends ICustom { }

class Personal extends Custom implements IPersonal {
  static factory<T extends Personal> () {
    return super.factory<T>();
  }

  static deserialize<T extends Personal> (personal: Personal | ISerializedPersonal) {
    return super.deserialize<T>(personal);
  }
}

export default Personal;
