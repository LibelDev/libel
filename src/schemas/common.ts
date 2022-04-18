import joi from 'joi';

export const uri = joi
  .string()
  .trim()
  .custom(encodeURI)
  .uri({ scheme: [/https?/] });
