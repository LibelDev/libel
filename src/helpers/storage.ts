import localForage from 'localforage';
import { namespace } from '../../package.json';

// backup localStorage
export const { localStorage } = window;

const main = localForage.createInstance({
  name: namespace,
  storeName: 'main',
  version: 1
});

export default main;
