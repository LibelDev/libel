import path from 'path';
import type webpack from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import merge from 'webpack-merge';
import { namespace } from '../../package.json';
import { Directory, port } from '../config';
import userscript from './plugins/userscript';
import base from './webpack.config.base';

const devServer: DevServerConfiguration = {
  hot: false,
  port,
  host: '127.0.0.1',
  allowedHosts: 'all',
  client: false,
  liveReload: false,
  devMiddleware: {
    writeToDisk: true
  },
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  static: [
    {
      directory: path.join(process.cwd(), Directory.Data),
      publicPath: `/${Directory.Data}`
    },
    {
      directory: path.join(process.cwd(), Directory.Assets),
      publicPath: `/${Directory.Assets}`
    }
  ]
};

const main: webpack.Configuration = {
  name: 'main',
  entry: {
    [namespace]: './src/main.ts'
  },
  plugins: [
    userscript
  ]
};

const config = merge(base, main);

export const dev = merge(config, { devServer });

export default config;
