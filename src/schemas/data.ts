import joi from 'joi';
import type { IData } from '../models/Data';
import label from './label';

const schema = joi.object<IData>().pattern(
  joi.string().pattern(/^\d+$/), // user ID
  joi.array().items(label)
);

export default schema;
