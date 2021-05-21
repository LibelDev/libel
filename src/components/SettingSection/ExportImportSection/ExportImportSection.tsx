import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as ATTRIBUTES from '../../../constants/attributes';
import * as PLACEHOLDERS from '../../../constants/placeholders';
import * as TEXTS from '../../../constants/texts';
import { getCurrentTimestamp } from '../../../helpers/date';
import { download } from '../../../helpers/file';
import Personal from '../../../models/Personal';
import Storage, { TMassagedStorage } from '../../../models/Storage';
import storage from '../../../storage';
import { actions as personalActions } from '../../../store/slices/personal';
import { actions as subscriptionsActions } from '../../../store/slices/subscriptions';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.scss';
import styles from './ExportImportSection.scss';

const ExportImportSection: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const handleExport: React.MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
    event.preventDefault();
    _export();
  }, []);

  const handleImport: React.ChangeEventHandler<HTMLInputElement> = useCallback(async (event) => {
    event.preventDefault();
    const { files } = event.target;
    const file = files!.item(0);
    if (file) {
      try {
        const data = await _import(file);
        if (data) {
          const { personal, subscriptions } = Storage.deserialize(data);
          dispatch(personalActions.update(personal));
          dispatch(subscriptionsActions.update(subscriptions));
          for (let i = 0; i < subscriptions.length; i++) {
            dispatch(subscriptionsActions.load(i));
          }
        }
      } catch (err) {
        if (typeof err === 'string') {
          window.alert(err);
        } else {
          // TODO display error
          console.error(err);
        }
      }
    }
    event.target.value = '';
  }, []);

  return (
    <React.Fragment>
      <small className={lihkgCssClasses.settingSectionTitle}>
        {TEXTS.SETTING_EXPORT_IMPORT_SECTION_TITLE}
      </small>
      <ul className={lihkgCssClasses.settingOptionsList}>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <a href="#" role="button" className={lihkgCssClasses.settingOptionButton} onClick={handleExport}>
            {TEXTS.EXPORT_FILE_BUTTON_TEXT}
          </a>
        </li>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <div>
            <input id={ATTRIBUTES.importFileInputId} className={styles.import} type="file" accept="text/json" onChange={handleImport} />
            <label htmlFor={ATTRIBUTES.importFileInputId} className={lihkgCssClasses.settingOptionButton}>
              {TEXTS.IMPORT_FILE_BUTTON_TEXT}
            </label>
            <small>{TEXTS.IMPORT_FILE_BUTTON_REMINDER}</small>
          </div>
        </li>
      </ul>
    </React.Fragment>
  );
};

// Helper functions
async function _export () {
  await storage.load();
  const json = storage.json();
  const timestamp = getCurrentTimestamp();
  const filename = TEXTS.EXPORT_FILE_NAME_TEMPLATE.replace(PLACEHOLDERS.TIMESTAMP, timestamp);
  // TODO so sad, there is no way to detect whether the user has downloaded the file or not
  download(json, filename);
  const { personal, subscriptions } = storage;
  const { users, labels } = personal.aggregate();
  const message = TEXTS.EXPORT_FILE_SUCCESS_MESSAGE
    .replace(PLACEHOLDERS.NUM_USERS, users.length as unknown as string)
    .replace(PLACEHOLDERS.NUM_LABELS, labels.length as unknown as string)
    .replace(PLACEHOLDERS.NUM_SUBSCRIPTIONS, subscriptions.length as unknown as string);
  window.alert(message);
}

function _import (file: File): Promise<TMassagedStorage | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.addEventListener('load', (event) => {
      const { result: json } = event.target!;
      if (typeof json === 'string') {
        let object;
        try {
          object = JSON.parse(json);
        } catch (err) {
          reject(TEXTS.IMPORT_FILE_DATA_FORMAT_ERROR_MESSAGE);
          return;
        }
        if (object) {
          const storage = Storage.validate(object);
          if (storage) {
            const { personal, subscriptions } = storage;
            const _personal = Personal.deserialize(personal);
            const { users, labels } = _personal.aggregate();
            const message = TEXTS.IMPORT_FILE_SUCCESS_MESSAGE
              .replace(PLACEHOLDERS.NUM_USERS, users.length as unknown as string)
              .replace(PLACEHOLDERS.NUM_LABELS, labels.length as unknown as string)
              .replace(PLACEHOLDERS.NUM_SUBSCRIPTIONS, (subscriptions?.length || 0) as unknown as string);
            window.alert(message);
            resolve(storage);
          } else {
            // storage validation error
            reject(TEXTS.IMPORT_FILE_DATA_FORMAT_ERROR_MESSAGE);
          }
        } else {
          resolve(null);
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
}

export default ExportImportSection;
