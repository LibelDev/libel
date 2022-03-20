import type { IUploadResponse } from '../types/nacx';

const baseURL = 'https://api.na.cx';

export const uploadImage = async (image: Blob) => {
  const url = `${baseURL}/upload`;
  const body = new FormData();
  body.append('image', image);
  const init: RequestInit = { method: 'POST', body };
  const response = await fetch(url, init);
  const json = await response.json();
  return json as IUploadResponse;
};
