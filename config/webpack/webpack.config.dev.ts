import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import merge from 'webpack-merge';
import { dataDirectory } from '../config';
import egg from './webpack.config.egg';
import main from './webpack.config.main';

interface IConfiguration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const dev: IConfiguration = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  devServer: {
    contentBase: dataDirectory,
    contentBasePublicPath: `/${dataDirectory}`,
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
};

const config = [
  merge(main, dev),
  merge(egg, dev)
];

export default config;
