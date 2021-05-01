import webpack from 'webpack';
import tsLoader from '../loaders/ts-loader';

const rule: webpack.RuleSetRule = {
  // exclude: /node_modules/,
  test: /\.tsx?$/,
  use: [
    tsLoader
  ]
};

export default rule;
