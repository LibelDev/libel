import format from 'date-fns/format';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { render } from 'mustache';
import { EXPORT_FILENAME_TIMESTAMP_FORMAT } from '../constants/files';
import * as TEXTS from '../constants/texts';
import Storage, { ISerializedStorage } from '../models/Storage';
import storage from '../storage';
import * as filenames from '../templates/filenames';

export const download = (filename: string, body: string, type: string) => {
  const blob = new Blob([body], { type });
  const anchor = document.createElement('a');
  const url = URL.createObjectURL(blob);
  anchor.setAttribute('href', url);
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  const click = new MouseEvent('click');
  anchor.dispatchEvent(click);
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const compress = (json: string) => {
  return compressToEncodedURIComponent(json);
};

export const decompress = (body: string) => {
  let object;
  try {
    // try to parse as json first (for backward compatibility)
    // `body` may be the actual json
    object = JSON.parse(body);
  } catch (err) {
    // the json was compressed
    const json = decompressFromEncodedURIComponent(body);
    object = JSON.parse(json!);
  }
  return object;
};

export const _export = async () => {
  await storage.load();
  const json = storage.json();
  const now = new Date();
  const timestamp = format(now, EXPORT_FILENAME_TIMESTAMP_FORMAT);
  const filename = render(filenames.data.export, { timestamp });
  // TODO so sad, there is no way to detect whether the user has downloaded the file or not
  download(filename, json, 'text/plain');
  return storage;
};

export const _import = (file: File) => {
  return new Promise<ISerializedStorage>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.addEventListener('load', (event) => {
      const { result: body } = event.target!;
      if (typeof body === 'string') {
        try {
          const object = decompress(body);
          const storage = Storage.validate(object);
          if (storage) {
            resolve(storage);
          } else {
            // storage validation error
            reject(TEXTS.IMPORT_FILE_ERROR_INVALID_DATA_FORMAT);
          }
        } catch (err) {
          // failed to parse the file
          reject(TEXTS.IMPORT_FILE_ERROR_INVALID_DATA_FORMAT);
          return;
        }
      } else {
        // cannot read file as string
        reject(TEXTS.IMPORT_FILE_ERROR_INVALID_DATA_FORMAT);
      }
    });
    reader.addEventListener('error', (event) => {
      reject(TEXTS.IMPORT_FILE_ERROR_GENERIC_ERROR);
    });
  });
};
