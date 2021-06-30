import cache from './cache';
import App from './models/App';
import store from './store/store';

const app = new App(cache, store);

export default app;
