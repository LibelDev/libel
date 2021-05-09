import localForage from 'localforage';
import { namespace } from '../../package.json';

const main = localForage.createInstance({
  name: namespace,
  storeName: 'main',
  version: 1
});

// backup localStorage
export const { localStorage } = window;

export default main;
