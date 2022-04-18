import type webpack from 'webpack';
import { publicURL } from '../config';
import environment from './plugins/environment';
import { resource, source, svg } from './rules/asset';
import scss from './rules/scss';
import typescript from './rules/typescript';

const config: webpack.Configuration = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: '[name].js',
    publicPath: `${publicURL}/`,
    assetModuleFilename: '[file]'
  },
  module: {
    rules: [
      resource,
      source,
      svg,
      scss,
      typescript
    ]
  },
  plugins: [
    environment
  ]
};

export default config;
