import webpack from 'webpack';
import merge from 'webpack-merge';
import { namespace } from '../../package.json';
import userscript from './plugins/userscript';
import base from './webpack.config.base';

const main: webpack.Configuration = {
  entry: {
    [namespace]: './src/main.ts'
  },
  plugins: [
    userscript
  ]
};

const config = merge(base, main);

export default config;
