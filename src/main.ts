import * as egg from './constants/egg';
import { isMainApp } from './helpers/app';
import { appendScript } from './helpers/dom';
import './stylesheets/lihkg.scss';
import './stylesheets/main.scss';

(async () => {
  appendScript(egg.src);
  if (isMainApp()) {
    const { default: app } = await import('./app');
    const { default: storage } = await import('./storage');
    await storage.ready();
    app.start();
  }
})();
