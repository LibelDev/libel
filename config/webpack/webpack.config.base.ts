import webpack from 'webpack';
import environment from './plugins/environment';
import asset from './rules/asset';
import scss from './rules/scss';
import typescript from './rules/typescript';

const config: webpack.Configuration = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      asset,
      scss,
      typescript
    ]
  },
  plugins: [
    environment
  ]
};

export default config;
