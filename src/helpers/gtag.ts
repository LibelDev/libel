import mem from 'mem';
import { id } from '../types/ga';
import { appendScriptToHead } from './dom';

const createScriptInnerHTML = (id: string) => {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag () { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', '${id}');
  `;
};

const init = mem(() => {
  return new Promise<Gtag.Gtag>((resolve) => {
    const src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    appendScriptToHead(src, true);
    const script = appendScriptToHead();
    script.innerHTML = createScriptInnerHTML(id);
    resolve(window.gtag);
  });
});

export const ready = () => init();

export const event = async (eventName: Gtag.EventNames | string, eventParams?: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams) => {
  const gtag = await ready();
  return gtag('event', eventName, eventParams);
};
