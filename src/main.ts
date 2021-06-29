import app from './app';
import storage from './storage';
import './stylesheets/lihkg.scss';
import './stylesheets/main.scss';

(async () => {
  await storage.ready();
  app.start();
})();
