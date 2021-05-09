import webpack from 'webpack';
import scss from './rules/scss';
import typescript from './rules/typescript';
import userscript from './plugins/userscript';
import { namespace } from '../../package.json';

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
