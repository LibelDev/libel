import WebpackUserscript from 'webpack-userscript';
import { dev } from '../../config';
import { displayName, version, description, author, repository, homepage } from '../../../package.json';

const plugin = new WebpackUserscript({
  headers: {
    name: displayName,
    version: dev ? `${version}-build.[buildNo]` : version,
    author,
    description,
    homepage,
    namespace: repository.url,
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
