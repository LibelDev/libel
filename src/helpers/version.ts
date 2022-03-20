import coerce from 'semver/functions/coerce';
import gt from 'semver/functions/gt';
import { repository, version as currentVersion } from '../../package.json';
import { fetchLatestRelease } from '../apis/github';
import type { IRelease } from '../types/github';

type TCheckUpdateResult = [boolean, string, string, IRelease] | [false, string, null, null];

export const checkUpdate = async (): Promise<TCheckUpdateResult> => {
  const path = repository.url.replace('https://github.com/', '');
  const [owner, repo] = path.split('/');
  const latestRelease = await fetchLatestRelease(owner, repo);
  if (latestRelease) {
    const latestSemver = coerce(latestRelease.tag_name);
    if (latestSemver) {
      const available = gt(latestSemver, currentVersion);
      return [available, currentVersion, latestSemver.version, latestRelease];
    }
  }
  return [false, currentVersion, null, null];
};
