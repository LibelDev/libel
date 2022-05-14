import crypto from 'crypto-js';
import * as LIHKG from '../helpers/lihkg';
import { localStorage } from '../helpers/storage';
import { RequestMethod } from '../types/http';
import type { APIv2 } from '../types/lihkg';

enum DeviceType {
  // Android = 'android',
  Browser = 'browser'
}

const baseURL = 'https://lihkg.com/api_v2';

const getDigestHeader = (url: string, init: RequestInit, data: Record<string, string> | undefined, timestamp: string, token: string) => {
  const { method } = init;
  const searchParams = new URLSearchParams(data);
  const messages = [
    'jeams',
    method,
    method === RequestMethod.GET && data ? `${url}?${searchParams.toString()}` : url,
    method === RequestMethod.POST && data ? JSON.stringify(data) : '',
    token,
    timestamp
  ];
  const hash = crypto.SHA1(messages.join('$'));
  return crypto.enc.Hex.stringify(hash);
};

const getLoadTimeHeader = (x: boolean) => {
  const a = (('false'[0] + x) + ('false'[2])).length;
  const b = 0 | 4 + Math.PI * Math.random();
  const c = b + '.';
  const d = a ^ b;
  const e = c + d;
  const f = 1000000 * Math.random();
  const g = f | 0;
  const h = e + g;
  return h;
};

const getPlusHeader = (timestamp: string) => {
  const a = 'false'[1] + [false] + undefined;
  const b = (window as any).isPlusUser;
  const c = a + b;
  const d = c + timestamp;
  const hash = crypto.SHA1(d);
  return crypto.enc.Hex.stringify(hash);
};

const getRequestHeaders = (url: string, init: RequestInit, data?: Record<string, string>) => {
  const store = LIHKG.getStore();
  const state = store!.getState();
  const device = localStorage.getItem('device');
  const { currentUser } = state.app;
  const headers: Record<string, string> = {
    'X-LI-DEVICE-TYPE': DeviceType.Browser,
    'X-LI-LOAD-TIME': getLoadTimeHeader(false)
  };
  if (device) {
    headers['X-LI-DEVICE'] = JSON.parse(device) as string;
  }
  if (currentUser) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    headers['X-LI-DIGEST'] = getDigestHeader(url, init, data, timestamp, currentUser.token);
    headers['X-LI-PLUS'] = getPlusHeader(timestamp);
    headers['X-LI-REQUEST-TIME'] = timestamp;
    headers['X-LI-USER'] = currentUser.user_id;
  }
  return headers;
};

export const fetchBlockedUser = async () => {
  const url = `${baseURL}/me/blocked-user`;
  const init: RequestInit = { method: RequestMethod.GET };
  const headers = getRequestHeaders(url, init);
  const response = await fetch(url, { ...init, headers });
  const json = await response.json();
  return json as APIv2.IBlockedUserResponseBody | APIv2.IErrorResponseBody;
};
