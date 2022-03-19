import dotenv from 'dotenv';
import { EnvironmentPlugin } from 'webpack';

dotenv.config();

const {
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_API_KEY,
  GOOGLE_CLIENT_ID,
  HANDSONTABLE_LICENSE_KEY
} = process.env;

const plugin = new EnvironmentPlugin({
  NODE_ENV: 'development',
  DEBUG_EGG: 'false',
  GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_API_KEY,
  GOOGLE_CLIENT_ID,
  HANDSONTABLE_LICENSE_KEY
});

export default plugin;
