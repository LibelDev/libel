import { namespace } from '../../package.json';
import { ANNOUNCEMENT_MESSAGE_DONT_SHOW_AGAIN_CONFIRMATION } from '../constants/texts';
import * as cookies from './cookies';

const prefix = `${namespace}-announcement-read-receipt`;

const getCookieName = (id: string) => {
  const name = `${prefix}-${id}`;
  return name;
};

export const hasRead = (id: string) => {
  const name = getCookieName(id);
  const value = cookies.get<boolean>(name);
  return value || false;
};

export const dontShowAgain = (id: string, expires: number) => {
  const name = getCookieName(id);
  cookies.set(name, true, { expires });
};

export const promptDontShowAgain = () => {
  return window.confirm(ANNOUNCEMENT_MESSAGE_DONT_SHOW_AGAIN_CONFIRMATION);
};
