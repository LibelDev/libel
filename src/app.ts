import cache from './cache';
import eggs from './eggs';
import App from './models/App';
import store from './store/store';

const app = new App(cache, store, eggs);

export default app;
