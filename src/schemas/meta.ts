import joi from 'joi';
import { ISerializedMeta } from './../models/Meta';

const schema = joi.object<ISerializedMeta>().keys({
  lastModifiedTime: joi.number().required(),
  lastSyncedTime: joi.number()
});

export default schema;
