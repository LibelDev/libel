import webpack from 'webpack';

const rule: webpack.RuleSetRule = {
  test: /\.(gif|jpg|png|svg|webp)$/i,
  type: 'asset/resource'
};

export default rule;
