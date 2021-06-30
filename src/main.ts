import app from './app';
import * as egg from './constants/egg';
import { appendScript } from './helpers/dom';
import storage from './storage';
import './stylesheets/lihkg.scss';
import './stylesheets/main.scss';

(async () => {
  await storage.ready();
  app.start();
  appendScript(egg.src);
})();
