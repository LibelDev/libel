import path from 'path';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import merge from 'webpack-merge';
import egg from './webpack.config.egg';
import main from './webpack.config.main';

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

const config = merge(main, dev);

export default [config, egg];
