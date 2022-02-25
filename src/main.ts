import * as egg from './constants/egg';
import { isMainApp, isOffline } from './helpers/app';
import { appendScript } from './helpers/dom';
// import './stylesheets/lihkg.scss';
// import './stylesheets/main.scss';

if (!isOffline()) {
  (async () => {
    appendScript(egg.src);
    if (isMainApp()) {
      require('./stylesheets/lihkg.scss');
      require('./stylesheets/main.scss');
      const { default: app } = await import('./app');
      const { default: storage } = await import('./storage');
      await storage.ready();
      await app.start();
      require('./sync');
      require('./ga');
    }
  })();
}
