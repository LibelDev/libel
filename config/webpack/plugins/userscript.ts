import path from 'path';
import { pathToFileURL } from 'url';
import WebpackUserscript from 'webpack-userscript';
import { author, description, displayName, homepage, repository, version } from '../../../package.json';
import { dev, Directory } from '../../config';

const buildDirectoryPath = path.join(process.cwd(), Directory.Build);
const baseBuildDirectoryURL = pathToFileURL(buildDirectoryPath);

const plugin = new WebpackUserscript({
  headers: {
    name: displayName,
    version: dev ? `${version}-build.[buildNo]` : version,
    author,
    description,
    homepage,
    namespace: repository.url,
    // noframes: true,
    include: 'https://lihkg.com/*',
    exclude: [
      // 'https://lihkg.com/me/2fa/totp/create',
      // 'https://lihkg.com/me/auto-logout/setting',
      // 'https://lihkg.com/me/deactivate',
      // 'https://lihkg.com/me/login-email/edit',
      // 'https://lihkg.com/me/password/edit',
      // 'https://lihkg.com/me/profile/edit',
      'https://lihkg.com/me/*',
      'https://lihkg.com/stickers'
    ],
    grant: 'none',
    'run-at': 'document-start'
  },
  proxyScript: {
    enable: dev,
    baseUrl: baseBuildDirectoryURL.href,
    filename: '[name].proxy.user.js'
  }
});

export default plugin;
