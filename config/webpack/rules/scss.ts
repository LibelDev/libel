// import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import cssLoader from '../loaders/css-loader';
import postcssLoader from '../loaders/postcss-loader';
import sassLoader from '../loaders/sass-loader';
import styleLoader from '../loaders/style-loader';
// import { dev } from '../../config';

const rule: webpack.RuleSetRule = {
  test: /\.s?css$/,
  use: [
    styleLoader,
    cssLoader,
    postcssLoader,
    sassLoader
  ]
};

export default rule;
