import '../env'; // load the environment variables at the beginning
import path from 'path';
import type webpack from 'webpack';
import merge from 'webpack-merge';
import { Directory } from '../config';
import egg from './webpack.config.egg';
import main from './webpack.config.main';

const prod: webpack.Configuration = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.join(process.cwd(), Directory.Dist)
  }
};

const config = [
  merge(main, prod),
  merge(egg, prod)
];

export default config;
