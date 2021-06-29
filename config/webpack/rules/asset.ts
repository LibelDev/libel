import webpack from 'webpack';

const rule: webpack.RuleSetRule = {
  test: /\.(svg|png|jpg|gif)$/i,
  type: 'asset/inline'
};

export default rule;
