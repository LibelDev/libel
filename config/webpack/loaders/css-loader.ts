import type webpack from 'webpack';
import { dev } from '../../config';

const loader: webpack.RuleSetUseItem = {
  loader: 'css-loader',
  options: {
    modules: {
      auto: true,
      localIdentName: dev ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64:5]',
      exportLocalsConvention: 'camelCase'
    }
  }
};

export default loader;
