import format from 'date-fns/format';
import { render } from 'mustache';
import * as TEXTS from '../constants/texts';
import Storage from '../models/Storage';
import storage from '../storage';
import * as filenames from '../templates/filenames';
import { exportFilenameTimestampFormat } from './../constants/files';
import { ISerializedStorage } from './../models/Storage';

export const download = (json: string, filename: string) => {
  const blob = new Blob([json], { type: 'text/json' });
  const anchor = document.createElement('a');
  const url = URL.createObjectURL(blob);
  anchor.setAttribute('href', url);
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const _import = (file: File) => {
  return new Promise<ISerializedStorage>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.addEventListener('load', (event) => {
      const { result: json } = event.target!;
      if (typeof json === 'string') {
        try {
          const object = JSON.parse(json);
          const storage = Storage.validate(object);
          if (storage) {
            resolve(storage);
          } else {
            // storage validation error
            reject(TEXTS.IMPORT_FILE_DATA_FORMAT_ERROR_MESSAGE);
          }
        } catch (err) {
          // failed to parse the json
          reject(TEXTS.IMPORT_FILE_DATA_FORMAT_ERROR_MESSAGE);
          return;
        }
      } else {
        // cannot read file as string
        reject(TEXTS.IMPORT_FILE_DATA_FORMAT_ERROR_MESSAGE);
      }
    });
    reader.addEventListener('error', (event) => {
      reject(TEXTS.IMPORT_FILE_GENERIC_ERROR_MESSAGE);
    });
  });
};

export const _export = async () => {
  await storage.load();
  const json = storage.json();
  const now = new Date();
  const timestamp = format(now, exportFilenameTimestampFormat);
  const filename = render(filenames.data.export, { timestamp });
  // TODO so sad, there is no way to detect whether the user has downloaded the file or not
  download(json, filename);
  return storage;
};
