import path from 'path';
import type webpack from 'webpack';
import { publicURL } from '../config';
import environment from './plugins/environment';
import { resource, source, svgr } from './rules/asset';
import scss from './rules/scss';
import typescript from './rules/typescript';

const config: webpack.Configuration = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      /* to fix invalid hook call warning when using `pnpm link` */
      react: path.resolve('./node_modules/react')
    }
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
      svgr,
      scss,
      typescript
    ]
  },
  plugins: [
    environment
  ]
};

export default config;
