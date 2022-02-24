import joi from 'joi';
import { ILabel } from '../models/Label';
import { HEX_COLOR } from './../constants/regexes';

export const text = joi.string().trim();
export const reason = joi.string().trim().allow('');
export const color = joi.string().trim().allow('').pattern(HEX_COLOR);
export const image = joi.string().trim().allow('');

const schema = joi.object<ILabel>({
  text: text.required(),
  reason,
  color,
  url: joi.string().trim().allow(''),
  date: joi.number(),
  source: joi.object({
    thread: joi.string().trim().required(),
    page: joi.number().required(),
    messageNumber: joi.string().trim().required()
  }),
  image
});

export default schema;
