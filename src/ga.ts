import { dev } from '../config/config';
import { googleAnalyticsMeasurementId } from './../config/config';
import { ready } from './helpers/gtag';

export const bootstrap = async () => {
  const gtag = await ready();
  gtag('js', new Date());
  gtag('config', googleAnalyticsMeasurementId, { debug_mode: dev });
};
