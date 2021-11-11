import Cookies, { CookieAttributes } from 'js-cookie';

export const get = <T> (name: string): T | undefined => {
  const json = Cookies.get(name);
  return json && JSON.parse(json);
};

export const set = <T> (name: string, value: T, options?: CookieAttributes) => {
  const _options = {
    expires: 7,
    ...options
  };
  const json = JSON.stringify(value);
  return Cookies.set(name, json, _options);
};
