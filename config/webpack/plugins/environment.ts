import { EnvironmentPlugin } from 'webpack';

const plugin = new EnvironmentPlugin({
  NODE_ENV: 'development',
  DEBUG_EGG: 'false'
});

export default plugin;
