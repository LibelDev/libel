import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import egg from './webpack.config.egg';
import main from './webpack.config.main';

const prod: webpack.Configuration = {
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.join(process.cwd(), '/dist')
  }
};

const config = [
  merge(main, prod),
  merge(egg, prod)
];

export default config;
