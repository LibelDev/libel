import webpack from 'webpack';

const rule: webpack.RuleSetRule = {
  test: /\.(svg|png|jpg|gif)$/i,
  type: 'asset/resource'
};

export default rule;
