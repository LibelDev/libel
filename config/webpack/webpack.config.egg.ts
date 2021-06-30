import webpack from 'webpack';
import merge from 'webpack-merge';
import base from './webpack.config.base';
import { name } from '../../src/constants/egg';

const egg: webpack.Configuration = {
  entry: {
    [name]: './src/egg.ts'
  }
};

const config = merge(base, egg);

export default config;
