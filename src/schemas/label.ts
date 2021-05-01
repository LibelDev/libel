import joi from 'joi';
import { ILabel } from '../models/Label';

const schema = joi.object<ILabel>({
  text: joi.string().required(),
  reason: joi.string().allow(''),
  url: joi.string().uri().allow(''),
  date: joi.number(),
  source: joi.object({
    thread: joi.string().required(),
    page: joi.number().required(),
    messageNumber: joi.string().required()
  })
});

export default schema;
