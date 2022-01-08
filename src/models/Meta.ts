import { immerable } from 'immer';

export interface ISerializedMeta {
  lastModifiedTime: number; // unix timestamp
  lastSyncedTime?: number; // unix timestamp
}

export interface IMeta extends ISerializedMeta { }

class Meta implements IMeta {
  [immerable] = true;
  lastModifiedTime: number;
  lastSyncedTime?: number;

  constructor (lastModifiedTime?: number, lastSyncedTime?: number) {
    this.lastModifiedTime = lastModifiedTime || Date.now();
    this.lastSyncedTime = lastSyncedTime;
  }

  static deserialize (meta: Meta | IMeta) {
    if (meta instanceof Meta) {
      return meta;
    }
    const { lastModifiedTime, lastSyncedTime } = meta;
    return new Meta(lastModifiedTime, lastSyncedTime);
  }

  serialize (): ISerializedMeta {
    const { lastModifiedTime, lastSyncedTime } = this;
    return {
      lastModifiedTime,
      lastSyncedTime
    };
  }
}

export default Meta;
