const dev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-preset-env',
    !dev ? 'cssnano' : undefined
  ]
};
