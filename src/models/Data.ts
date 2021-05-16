import Label from './Label';

export interface IData {
  [user: string]: Label[] | undefined;
}

class Data implements IData {
  [user: string]: Label[] | undefined;

  constructor (data: IData = {}) {
    for (const user in data) {
      this[user] = data[user]?.map(Label.deserialize);
    }
  }
}

export default Data;
