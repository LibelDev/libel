import coerce from 'semver/functions/coerce';
import gt from 'semver/functions/gt';
import { fetchLatestRelease } from '../apis/github';
import { IRelease } from '../types/github';
import { version as currentVersion, repository } from '../../package.json';

type CheckUpdateResult = [boolean, string, string, IRelease] | [false, string, null, null];

export const checkUpdate = async (): Promise<CheckUpdateResult> => {
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
