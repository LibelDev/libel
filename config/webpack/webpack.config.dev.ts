import '../env'; // load the environment variables at the beginning
import path from 'path';
import type webpack from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import merge from 'webpack-merge';
import { Directory, port } from '../config';
import egg from './webpack.config.egg';
import main from './webpack.config.main';

const devServer: DevServerConfiguration = {
  hot: false,
  port,
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

const dev: webpack.Configuration = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  devServer
};

const config = [
  merge(main, dev),
  merge(egg, dev)
];

export default config;
