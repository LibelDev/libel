import { id } from '../constants/ga';
import { appendScript } from './dom';
import * as singleton from './singleton';

type TWindow = typeof window & {
  dataLayer: any[];
};

const init = () => {
  return new Promise<typeof window.gtag>((resolve) => {
    const script = appendScript(`https://www.googletagmanager.com/gtag/js?id=${id}`, true);
    script.addEventListener('load', () => {
      const _window = window as TWindow;
      _window.dataLayer = _window.dataLayer || [];
      _window.gtag = (...args: any[]) => { _window.dataLayer.push(args); };
      resolve(_window.gtag);
    });
  });
};

export const ready = singleton.create(init());
