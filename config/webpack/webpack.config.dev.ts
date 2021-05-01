import path from 'path';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import merge from 'webpack-merge';
import common from './webpack.config';

interface IConfiguration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const dev: IConfiguration = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  output: {
    filename: '[name].js',
    path: path.join(process.cwd(), '/dist')
  }
};

const config = merge(common, dev);

export default config;
