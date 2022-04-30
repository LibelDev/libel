import type { APIv2 } from '../types/lihkg';

const baseURL = 'https://lihkg.com/api_v2';

export const fetchBlockedUser = async () => {
  const url = `${baseURL}/me/blocked-user`;
  const response = await fetch(url);
  const json = await response.json();
  return json as APIv2.IBlockedUserResponseBody | APIv2.IErrorResponseBody;
};
