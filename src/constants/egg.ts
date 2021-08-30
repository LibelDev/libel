import { dev } from '../../config/config';
import { homepage } from '../../package.json';

export const name = 'egg';

const baseURL = dev ? 'http://localhost:8080' : `${homepage}/dist`;

export const src = `${baseURL}/${name}.js`;
