import webpack from 'webpack';

export const resource: webpack.RuleSetRule = {
  test: /\.(gif|jpg|png|svg|webp)$/i,
  type: 'asset/resource'
};

export const source: webpack.RuleSetRule = {
  test: /\.txt$/i,
  type: 'asset/source'
};
