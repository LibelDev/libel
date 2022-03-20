import joi from 'joi';
import type { ISerializedConfig } from '../models/Config';

const schema = joi.object<ISerializedConfig>().keys({
  isIconMapUnlocked: joi.boolean()
});

export default schema;
