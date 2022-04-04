import joi from 'joi';
import type { ISerializedConfig } from '../models/Config';
import { basic } from './subscription';

const schema = joi.object<ISerializedConfig>().keys({
  isIconMapUnlocked: joi.boolean(),
  subscriptionTemplates: joi.array().items(basic)
});

export default schema;
