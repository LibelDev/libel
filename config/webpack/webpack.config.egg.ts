import type webpack from 'webpack';
import merge from 'webpack-merge';
import { NAME } from '../../src/constants/egg';
import base from './webpack.config.base';

const egg: webpack.Configuration = {
  name: 'egg',
  entry: {
    [NAME]: './src/egg.ts'
  }
};

const config = merge(base, egg);

export default config;
