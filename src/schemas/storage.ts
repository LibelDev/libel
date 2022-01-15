import joi from 'joi';
import { ILabelDatum } from '../models/Label';
import { ISerializedStorage } from '../models/Storage';
import data from './data';
import label from './label';
import config from './config';
import meta from './meta';
import personal from './personal';
import * as subscription from './subscription';

export const deprecated = joi.alternatives().try(
  data,
  joi.array().items(
    joi.object<ILabelDatum>({
      user: joi.string().required(),
      labels: joi.array().items(
        joi.alternatives().try(
          label,
          joi.string()
        )
      )
    })
  )
);

const schema = joi.object<ISerializedStorage>({
  config: config.unknown(),
  meta: meta.unknown(),
  personal: personal.required(),
  subscriptions: joi.array().items(subscription.serialized).required()
});

export default schema;
