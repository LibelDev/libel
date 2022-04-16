import type webpack from 'webpack';
import { dev } from '../../config';
import svgLoader from '../loaders/svg-loader';

export const resource: webpack.RuleSetRule = {
  test: /\.(gif|jpg|png|svg|webp)$/i,
  type: 'asset/resource',
  generator: { emit: false }
};

export const source: webpack.RuleSetRule = {
  test: /\.txt$/i,
  type: 'asset/source'
};

export const svg: webpack.RuleSetRule = {
  test: /\.svg$/i,
  issuer: /\.[jt]sx?$/,
  use: [svgLoader]
};
