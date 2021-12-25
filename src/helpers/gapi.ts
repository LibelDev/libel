import { appendScript } from './dom';

const loadClient = (): Promise<void> => {
  return new Promise((resolve) => {
    gapi.load('client:auth2', resolve);
  });
};

const initClient = (apiKey: string, discoveryDocs: string[], clientId: string, scopes: string[]) => {
  return gapi.client.init({
    apiKey,
    discoveryDocs,
    clientId,
    scope: scopes.join(' ')
  });
};

const init = () => {
  const script = appendScript('https://apis.google.com/js/api.js');
  let loaded = false;
  let callback = (gapi: typeof window.gapi) => { };
  script.addEventListener('load', async () => {
    await loadClient();
    const apiKey = process.env.GOOGLE_API_KEY!;
    const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const scopes = ['https://www.googleapis.com/auth/drive.appdata'];
    await initClient(apiKey, discoveryDocs, clientId, scopes);
    loaded = true;
    callback(window.gapi);
  });
  return () => {
    return new Promise<typeof window.gapi>((resolve) => {
      callback = resolve;
      if (loaded) {
        resolve(window.gapi);
      }
    });
  };
};

export const ready = init();
