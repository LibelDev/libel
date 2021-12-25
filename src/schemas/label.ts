import joi from 'joi';
import { ILabel } from '../models/Label';
import { HEX_COLOR } from './../constants/regexes';

const schema = joi.object<ILabel>({
  text: joi.string().trim().required(),
  reason: joi.string().trim().allow(''),
  color: joi.string().trim().pattern(HEX_COLOR).allow(''),
  url: joi.string().trim().allow(''),
  date: joi.number(),
  source: joi.object({
    thread: joi.string().trim().required(),
    page: joi.number().required(),
    messageNumber: joi.string().trim().required()
  }),
  image: joi.string().trim().allow('')
});

export default schema;
