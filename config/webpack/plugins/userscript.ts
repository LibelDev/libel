import WebpackUserscript from 'webpack-userscript';
import { author, description, displayName, homepage, repository, version } from '../../../package.json';
import { dev } from '../../config';

const plugin = new WebpackUserscript({
  headers: {
    name: displayName,
    version: dev ? `${version}-build.[buildNo]` : version,
    author,
    description,
    homepage,
    namespace: repository.url,
    noframes: true,
    include: 'https://lihkg.com/*',
    grant: 'none',
    'run-at': 'document-start'
  },
  proxyScript: {
    enable: dev,
    filename: '[name].proxy.user.js'
  }
});

export default plugin;
