import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
// import miniCssExtractPlugin from './plugins/mini-css-extract-plugin';
import common from './webpack.config';

const prod: webpack.Configuration = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.join(process.cwd(), '/dist')
  }
};

const config = merge(common, prod);

export default config;
