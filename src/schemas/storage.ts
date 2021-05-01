import joi from 'joi';
import data from './data';
import dataSet from './dataSet';
import label from './label';
import * as subscription from './subscription';
import { ILabelDatum } from '../models/Label';
import { ISerializedStorage } from '../models/Storage';

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
  personal: dataSet,
  subscriptions: joi.array().items(subscription.serialized).required()
});

export default schema;
