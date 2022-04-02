import type { ValidationError } from 'joi';

type TIteratee<T> = (previousValue: T, key?: string, label?: string, value?: string, message?: string) => T;

export const mapValidationError = <T> (error: ValidationError | undefined, iteratee: TIteratee<T>, initialValue: T): T => {
  let _value = initialValue;
  if (error) {
    const { details } = error;
    for (const detail of details) {
      const { context, message } = detail;
      const { key, label, value } = context || {};
      _value = iteratee(_value, key, label, value, message);
    }
  }
  return _value;
};
