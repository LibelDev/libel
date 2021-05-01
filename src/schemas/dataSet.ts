import joi from 'joi';
import data from './data';
import { IDataSet } from './../models/DataSet';

const schema = joi.object<IDataSet>({
  data: data.required()
});

export default schema;
