import { immerable } from 'immer';
import Label, { ILabel } from './Label';

export interface IData {
  [user: string]: ILabel[] | undefined;
}

class Data implements IData {
  [immerable] = true;
  [user: string]: Label[] | undefined;

  constructor (data: IData = {}) {
    for (const user in data) {
      this[user] = data[user]?.map(Label.deserialize);
    }
  }
}

export default Data;
