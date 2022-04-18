import { EnvironmentPlugin } from 'webpack';

const {
  PORT,
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_API_KEY,
  GOOGLE_CLIENT_ID
} = process.env;

const plugin = new EnvironmentPlugin({
  NODE_ENV: 'development',
  EGG: 'false',
  PORT,
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_API_KEY,
  GOOGLE_CLIENT_ID
});

export default plugin;
