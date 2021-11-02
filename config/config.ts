import { homepage } from '../package.json';

export const dev = process.env.NODE_ENV === 'development';
export const debugEgg = process.env.DEBUG_EGG === 'true';

export const publicURL = dev ? 'http://localhost:8080' : `${homepage}/dist`;
export const publicDataURL = dev ? 'http://localhost:20630' : `${homepage}/data`;
