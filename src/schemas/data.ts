import joi from 'joi';
import { IData } from './../models/DataSet';
import label from './label';

const schema = joi.object<IData>().pattern(
  joi.string().pattern(/^\d+$/),
  joi.array().items(label)
);

export default schema;
