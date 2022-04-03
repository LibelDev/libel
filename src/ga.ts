import { dev } from '../config/config';
import { id } from './constants/ga';
import { ready } from './helpers/gtag';

export const bootstrap = async () => {
  const gtag = await ready();
  gtag('js', new Date());
  gtag('config', id, { debug_mode: dev });
};
