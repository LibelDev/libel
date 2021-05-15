import joi from 'joi';
import { IDataSet } from './../models/DataSet';
import data from './data';

const schema = joi.object<IDataSet>({
  data: data.required()
});

export default schema;
