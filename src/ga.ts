import { dev } from '../config/config';
import { ready } from './helpers/gtag';
import { id } from './types/ga';

export const bootstrap = async () => {
  const gtag = await ready();
  gtag('js', new Date());
  gtag('config', id, { debug_mode: dev });
};
