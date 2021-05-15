import joi from 'joi';
import { HEX_COLOR } from '../constants/regexes';
import { IRemoteSubscription, ISerializedSubscription } from './../models/Subscription';
import data from './data';

export const serialized = joi.object<ISerializedSubscription>({
  url: joi.string().required(),
  enabled: joi.boolean().required(),
  name: joi.string().required()
});

export const remote = joi.object<IRemoteSubscription>({
  data: data.required(),
  name: joi.string().required(),
  version: joi.string().required(),
  homepage: joi.string(),
  color: joi.string().pattern(HEX_COLOR)
});

// const schema = joi.object({
//   ...serialized,
//   ...remote
// });

// export default schema;
