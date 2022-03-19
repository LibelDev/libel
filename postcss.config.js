const tailwindcss = require('tailwindcss');
const preset = require('postcss-preset-env');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    tailwindcss(),
    preset(),
    cssnano()
  ]
};
