import '../env'; // load the environment variables at the beginning
import path from 'path';
import type webpack from 'webpack';
import merge from 'webpack-merge';
import { Directory } from '../config';
import { dev as egg } from './webpack.config.egg';
import { dev as main } from './webpack.config.main';

const dev: webpack.Configuration = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  output: {
    path: path.join(process.cwd(), Directory.Build),
  }
};

const config = [
  merge(main, dev),
  merge(egg, dev)
];

export default config;
