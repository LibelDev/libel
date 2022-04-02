import { id } from '../constants/ga';
import Singleton from '../models/Singleton';
import { appendScript } from './dom';

type TWindow = typeof window & {
  dataLayer: any[];
};

const init = () => {
  return new Promise<Gtag.Gtag>((resolve) => {
    const src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    const script = appendScript(src, true);
    script.addEventListener('load', () => {
      const _window = window as TWindow;
      _window.dataLayer = _window.dataLayer || [];
      _window.gtag = _window.gtag || ((...args: any[]) => { _window.dataLayer.push(args); });
      resolve(_window.gtag);
    });
  });
};

const source = init();
const singleton = new Singleton(source);
export const ready = () => singleton.get();

export const event = async (eventName: Gtag.EventNames | string, eventParams?: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams) => {
  const gtag = await ready();
  return gtag('event', eventName, eventParams);
};
