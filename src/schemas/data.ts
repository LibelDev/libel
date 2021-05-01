import joi from 'joi';
import label from './label';
import { IData } from './../models/DataSet';

const schema = joi.object<IData>().pattern(
  joi.string().pattern(/^\d+$/),
  joi.array().items(label)
);

export default schema;
