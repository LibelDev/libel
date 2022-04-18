import path from 'path';
import type webpack from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import merge from 'webpack-merge';
import { NAME } from '../../src/constants/egg';
import { Directory, port } from '../config';
import base from './webpack.config.base';

const devServer: DevServerConfiguration = {
  hot: false,
  port,
  client: false,
  liveReload: false,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  static: [
    {
      directory: path.join(process.cwd(), Directory.Assets),
      publicPath: `/${Directory.Assets}`
    }
  ]
};

const egg: webpack.Configuration = {
  name: 'egg',
  entry: {
    [NAME]: './src/egg.ts'
  }
};

const config = merge(base, egg);

export const dev = merge(config, { devServer });

export default config;
