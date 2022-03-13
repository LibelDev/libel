import * as egg from './constants/egg';
import { isMainApp, isOffline } from './helpers/app';
import { appendScript } from './helpers/dom';

if (!isOffline()) {
  (async () => {
    appendScript(egg.src);
    if (isMainApp()) {
      require('./stylesheets/lihkg.scss');
      require('./stylesheets/main.scss');
      const { default: app } = await import('./app');
      app.start();
      require('./sync');
      require('./ga');
    }
  })();
}
