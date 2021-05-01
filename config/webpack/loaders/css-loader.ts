import { dev } from '../../config';

const loader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: dev ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64:5]',
      exportLocalsConvention: 'camelCase'
    }
  }
};

export default loader;
