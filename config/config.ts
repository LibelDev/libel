import { homepage } from '../package.json';

export enum Directory {
  Assets = 'assets',
  Build = 'build',
  Data = 'data',
  Dist = 'dist'
};

export enum File {
  Announcements = 'announcements.json'
}

export const port = parseInt(process.env.PORT || '8080');

export const dev = process.env.NODE_ENV === 'development';
export const debugEgg = process.env.EGG === 'true';

export const publicURL = dev ? `http://localhost:${port}` : homepage;
export const publicDataURL = `${publicURL}/${Directory.Data}`;
export const publicDistURL = dev ? publicURL : `${publicURL}/${Directory.Dist}`;
export const imageProxyURL = dev ? `http://localhost:${port + 1}` : process.env.GOOGLE_GAE_SERVICE_URL;

export const googleAnalyticsMeasurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID!;
export const googleApiKey = process.env.GOOGLE_API_KEY!;
export const googleClientId = process.env.GOOGLE_CLIENT_ID!;
export const googleOAuthScopes = process.env.GOOGLE_OAUTH_SCOPES?.split(',') || [];
