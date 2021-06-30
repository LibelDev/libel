import { homepage } from '../../package.json';
import * as env from '../helpers/env';

export const name = 'egg';

const baseURL = env.dev ? 'http://localhost:8080' : `${homepage}/dist`;

export const src = `${baseURL}/${name}.js`;
