import { IRelease } from '../types/github';

const baseURL = 'https://api.github.com';

export const fetchLatestRelease = async (owner: string, repo: string) => {
  const url = `${baseURL}/repos/${owner}/${repo}/releases/latest`;
  const response = await fetch(url);
  const release = await response.json();
  return release as IRelease;
};