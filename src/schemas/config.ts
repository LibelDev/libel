import joi from 'joi';
import type { ISerializedConfig } from '../models/Config';
import { base } from './subscription';

const schema = joi.object<ISerializedConfig>().keys({
  isIconMapUnlocked: joi.boolean(),
  subscriptionTemplates: joi.array().items(base)
});

export default schema;
