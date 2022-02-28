import Custom, { ICustom, ISerializedCustom } from './Custom';

export interface ISerializedPersonal extends ISerializedCustom { }

export interface IPersonal extends ICustom { }

class Personal extends Custom implements IPersonal {
}

export default Personal;
