import { appendScript } from './helpers/dom';

const id = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID;

const script = appendScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);

script.addEventListener('load', () => {
  window.dataLayer = window.dataLayer || [];
  function gtag () { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', id);
});
