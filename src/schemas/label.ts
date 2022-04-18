import joi from 'joi';
import { HEX_COLOR } from '../constants/regexes';
import type { ILabel } from '../models/Label';
import { uri } from './common';

export const id = joi.string().trim();
export const text = joi.string().trim();
export const reason = joi.string().trim().allow('');
export const color = joi.string().trim().allow('').pattern(HEX_COLOR);
export const image = uri.allow('');

const schema = joi.object<ILabel>({
  id,
  text: text.required(),
  reason,
  color,
  url: uri.allow(''),
  date: joi.number(),
  source: joi.object({
    thread: joi.string().trim().required(),
    page: joi.number().required(),
    messageNumber: joi.string().trim().required()
  }),
  image
});

export default schema;
