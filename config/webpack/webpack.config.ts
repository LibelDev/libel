import webpack from 'webpack';
import { namespace } from '../../package.json';
import userscript from './plugins/userscript';
import scss from './rules/scss';
import typescript from './rules/typescript';

const config: webpack.Configuration = {
  entry: {
    [namespace]: './src/main.ts'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      scss,
      typescript
    ]
  },
  plugins: [
    userscript
  ]
};

export default config;
