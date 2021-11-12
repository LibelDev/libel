import { appendScript } from './helpers/dom';

const script = appendScript('https://www.googletagmanager.com/gtag/js?id=G-7EV37MQDX0');

script.addEventListener('load', () => {
  window.dataLayer = window.dataLayer || [];
  function gtag () { dataLayer.push(arguments); }
  gtag('js', new Date());

  gtag('config', 'G-7EV37MQDX0');
});
