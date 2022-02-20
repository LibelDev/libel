import Singleton from '../models/Singleton';
import { appendScript } from './dom';

type TClientDriveFilesGetRequestWithoutFileId = Omit<Parameters<typeof gapi.client.drive.files.get>[0], 'fileId'>;
type TSpaces = ('drive' | 'appDataFolder')[];

const loadClient = (apiName: string): Promise<void> => {
  return new Promise((resolve) => {
    const { gapi } = window;
    gapi.load(apiName, resolve);
  });
};

const initClient = (apiKey: string, discoveryDocs: string[], clientId: string, scopes: string[]) => {
  const { gapi } = window;
  return gapi.client.init({
    apiKey,
    discoveryDocs,
    clientId,
    scope: scopes.join(' ')
  });
};

const init = () => {
  return new Promise<typeof gapi>((resolve) => {
    const src = 'https://apis.google.com/js/api.js';
    const script = appendScript(src);
    script.addEventListener('load', async () => {
      await loadClient('client:auth2');
      const apiKey = process.env.GOOGLE_API_KEY!;
      const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
      const clientId = process.env.GOOGLE_CLIENT_ID!;
      const scopes = ['https://www.googleapis.com/auth/drive.appdata'];
      await initClient(apiKey, discoveryDocs, clientId, scopes);
      resolve(window.gapi);
    });
  });
};

const singleton = new Singleton(init());
export const ready = () => singleton.get();

/**
 * Google Drive V3 API wrapper
 */
export const drive = {
  /**
   * get the file by name, or create it if not exists yet
   * @async
   * @param {string} name file name
   */
  async ensure (name: string): Promise<[gapi.client.drive.File, boolean]> {
    const file = await this.getByName(name);
    if (file) {
      return [file, false];
    }
    const response = await this.create(name);
    const { result } = response;
    return [result, true];
  },
  /**
   * create file
   * @async
   * @param {string} name file name
   * @param {string[]} parents default: `["appDataFolder"]`
   * @param {string[]} fields file fields to be included in the response, default: `["id", "name", "createdTime", "modifiedTime"]`
   */
  async create (name: string, parents: string[] = ['appDataFolder'], fields: string[] = ['id', 'name', 'createdTime', 'modifiedTime']) {
    const gapi = await ready();
    return gapi.client.drive.files.create({
      resource: { name, parents },
      fields: fields.join(', ')
    });
  },
  /**
   * update file
   * @async
   * @param {string} id file id
   * @param {string} body file content
   * @param {string[]} fields file fields to be included in the response, default: `["id", "name", "createdTime", "modifiedTime"]`
   */
  async update (id: string, body: string, fields: string[] = ['id', 'name', 'createdTime', 'modifiedTime']): Promise<gapi.client.Response<gapi.client.drive.File>> {
    const gapi = await ready();
    return gapi.client.request({
      path: `/upload/drive/v3/files/${id}`,
      method: 'PATCH',
      params: {
        uploadType: 'media',
        fields: fields.join(', ')
      },
      body
    });
  },
  /**
   * get the list of files under "appDataFolder"
   * @async
   * @param {TSpaces} spaces default: `["appDataFolder"]`
   * @param {string[]} fields file fields to be included in the response, default: `["id", "name", "createdTime", "modifiedTime"]`
   */
  async list (spaces: TSpaces = ['appDataFolder'], fields: string[] = ['id', 'name', 'createdTime', 'modifiedTime']) {
    const gapi = await ready();
    return gapi.client.drive.files.list({
      spaces: spaces.join(''),
      fields: `files(${fields.join(', ')})`
    });
  },
  /**
   * get the file by id
   * @async
   * @param {string} id file id
   * @param {TClientDriveFilesGetRequestWithoutFileId} request the request object for `gapi.client.drive.files.get`
   * @param {string[]} request.fields file fields to be included in the response, default: `["id", "name", "createdTime", "modifiedTime"]`
   * @template R the type of the response result
   */
  async getById<R = gapi.client.drive.File> (id: string, request?: TClientDriveFilesGetRequestWithoutFileId) {
    const gapi = await ready();
    const fields = ['id', 'name', 'createdTime', 'modifiedTime'];
    return gapi.client.drive.files.get({
      fileId: id,
      fields: fields.join(', '),
      ...request
    }) as gapi.client.Request<R>;
  },
  /**
   * get the file by name
   * @async
   * @param {string} name file name
   */
  async getByName (name: string) {
    const response = await this.list();
    const { result } = response;
    const { files } = result;
    if (files) {
      for (const file of files) {
        if (file.name === name) {
          return file;
        }
      }
    }
  },
  async deleteById (id: string) {
    const gapi = await ready();
    return gapi.client.drive.files.delete({
      fileId: id
    });
  },
  /**
   * delete the file by name
   * @param {string} name file name
   */
  async deleteByName (name: string) {
    const file = await this.getByName(name);
    if (file) {
      return this.deleteById(file.id!);
    }
  }
};
