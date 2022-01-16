import { id } from '../constants/ga';
import { appendScript } from './dom';
import * as singleton from './singleton';

type TWindow = typeof window & {
  dataLayer: any[];
};

const init = () => {
  return new Promise<Gtag.Gtag>((resolve) => {
    const script = appendScript(`https://www.googletagmanager.com/gtag/js?id=${id}`, true);
    script.addEventListener('load', () => {
      const _window = window as TWindow;
      _window.dataLayer = _window.dataLayer || [];
      _window.gtag = _window.gtag || ((...args: any[]) => { _window.dataLayer.push(args); });
      resolve(_window.gtag);
    });
  });
};

export const ready = singleton.create(init());

export const event = async (eventName: Gtag.EventNames | string, eventParams?: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams) => {
  const gtag = await ready();
  return gtag('event', eventName, eventParams);
};
