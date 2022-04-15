import path from 'path';
import type webpack from 'webpack';
import merge from 'webpack-merge';
import { outputDirectory } from './../config';
import egg from './webpack.config.egg';
import main from './webpack.config.main';

const prod: webpack.Configuration = {
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.join(process.cwd(), outputDirectory),
    assetModuleFilename: '[file]'
  }
};

const config = [
  merge(main, prod),
  merge(egg, prod)
];

export default config;
