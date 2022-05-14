import sass from 'sass';
import type webpack from 'webpack';

const loader: webpack.RuleSetUseItem = {
  loader: 'sass-loader',
  options: {
    implementation: sass
  }
};

export default loader;
