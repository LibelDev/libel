import joi from 'joi';
import { HEX_COLOR } from '../constants/regexes';
import type { IBaseRemoteSubscription, IBaseSubscription, ISerializedSubscription } from './../models/Subscription';
import { uri } from './common';
import dataSet from './dataSet';

export const serialized = joi.object<ISerializedSubscription>({
  /**
   * allow empty string because the remote
   * file may not be loaded yet before
   * the subscription being serialized
   */
  name: joi.string().allow(''),
  version: joi.string().trim(),
  url: uri.required(),
  enabled: joi.boolean().required()
});

export const basic = joi.object<IBaseSubscription>({
  name: joi.string().required(),
  version: joi.string().trim().required(),
  homepage: uri.allow(''),
  color: joi.string().pattern(HEX_COLOR)
});

export const baseRemote = (basic as joi.ObjectSchema<IBaseRemoteSubscription>)
  .concat(dataSet);
