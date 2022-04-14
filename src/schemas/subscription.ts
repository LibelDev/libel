import joi from 'joi';
import { HEX_COLOR } from '../constants/regexes';
import type { IBaseRemoteSubscription, IBaseSubscription, ISerializedSubscription } from './../models/Subscription';
import { uri } from './common';
import dataSet from './dataSet';

export const name = joi.string().trim();
export const version = joi.string().trim();
export const homepage = uri.allow('');
export const color = joi.string().trim().allow('').pattern(HEX_COLOR);

export const serialized = joi.object<ISerializedSubscription>({
  /**
   * allow empty string because the remote file may not be
   * loaded yet before the subscription being serialized
   */
  name: name.allow(''),
  version,
  url: uri.required(),
  enabled: joi.boolean().required()
});

export const base = joi.object<IBaseSubscription>({
  name: name.required(),
  version: version.required(),
  /**
   * use normal string for backward compatibility, because
   * `subscriptionTemplates` with non-URI `homepage` may
   * have already been stored, using `uri` will lead to
   * validation error in the next app session
   */
  homepage: joi.string().trim().allow(''),
  color
});

export const baseRemote = ((base as joi.ObjectSchema<IBaseRemoteSubscription>)
  .keys({ homepage })
  .concat(dataSet));
