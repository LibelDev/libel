// import * as EGG from './constants/egg';
import { isMainApp, isOffline } from './helpers/app';
// import { appendScriptToBody } from './helpers/dom';

(async () => {
  if (!isOffline()) {
    if (isMainApp()) {
      require('./stylesheets/lihkg.scss');
      require('./stylesheets/main.scss');
      const { default: app } = await import('./app');
      app.bootstrap();
      const { default: cloud } = await import('./cloud');
      cloud.bootstrap();
      const ga = await import('./ga');
      ga.bootstrap();
    }
    // appendScriptToBody(EGG.SCRIPT_URL);
  }
})();
