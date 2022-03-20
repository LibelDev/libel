import cache from './cache';
import App from './models/App';
import store, { persistor } from './store/store';

const app = new App(cache, store, persistor);

export default app;
