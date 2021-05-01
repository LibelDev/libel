const preset = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    tailwindcss(),
    preset()
  ]
};
