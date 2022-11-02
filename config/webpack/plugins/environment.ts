import { EnvironmentPlugin } from 'webpack';

const {
  PORT,
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_API_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_GAE_SERVICE_URL
} = process.env;

const plugin = new EnvironmentPlugin({
  NODE_ENV: 'development',
  EGG: 'false',
  PORT,
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_API_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_GAE_SERVICE_URL
});

export default plugin;
