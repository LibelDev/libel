import debugFactory from 'debug';
import { render } from 'mustache';
import React, { useCallback, useState } from 'react';
import { EventAction } from '../../../constants/ga';
import * as TEXTS from '../../../constants/texts';
import { _export, _import } from '../../../helpers/file';
import * as gtag from '../../../helpers/gtag';
import { MergeDirection, mergePersonal, mergeSubscriptions } from '../../../helpers/merge';
import useElementID from '../../../hooks/useElementID';
import Personal from '../../../models/Personal';
import { ISerializedStorage } from '../../../models/Storage';
import { selectConfig, selectPersonal, selectSubscriptions } from '../../../store/selectors';
import { actions as personalActions } from '../../../store/slices/personal';
import { loadDataIntoStore, useTypedDispatch, useTypedSelector } from '../../../store/store';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import * as messages from '../../../templates/messages';
import DataSetEditorModal from '../../DataSetEditorModal/DataSetEditorModal';
import SettingOptionButton from '../SettingOptionButton/SettingOptionButton';
import styles from './ManageDataSection.module.scss';

const debug = debugFactory('libel:component:ManageDataSection');

const ManageDataSection: React.FunctionComponent = () => {
  const dispatch = useTypedDispatch();
  const config = useTypedSelector(selectConfig);
  const personal = useTypedSelector(selectPersonal);
  const subscriptions = useTypedSelector(selectSubscriptions);
  const importFileInputId = useElementID('ImportFileInput');
  const [dataSetEditorModalOpened, setDataSetEditorModalOpened] = useState(false);

  const handleEditDataSetButtonClick = useCallback(() => {
    setDataSetEditorModalOpened(true);
  }, []);

  const handleDataSetEditorModalClose = useCallback(() => {
    setDataSetEditorModalOpened(false);
  }, []);

  const handleExport: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    try {
      const data = await _export();
      // analytics
      gtag.event(EventAction.Export);
      const { personal, subscriptions } = data;
      const { users, labels } = personal.aggregate();
      const message = render(messages.success.export, { users, labels, subscriptions });
      window.alert(message);
    } catch (err) {
      // analytics
      gtag.event(EventAction.Error, { event_category: EventAction.Export });
    }
  }, []);

  const handleImport: React.ChangeEventHandler<HTMLInputElement> = useCallback(async (event) => {
    event.preventDefault();
    const { files } = event.target;
    const file = files?.item(0);
    if (file) {
      try {
        const data = await _import(file);
        const storage: ISerializedStorage = {
          config: { ...config, ...data.config },
          // CAVEAT: ignore `meta` here
          personal: mergePersonal(personal, data.personal, MergeDirection.IncomingToLocal),
          subscriptions: mergeSubscriptions(subscriptions, data.subscriptions, MergeDirection.IncomingToLocal)
        };
        // load the merged data into the store
        await loadDataIntoStore(storage);
        // analytics
        gtag.event(EventAction.Import);
        const { users, labels } = Personal.aggregate(data.personal);
        const _message = render(messages.success.import, { users, labels, subscriptions: data.subscriptions });
        window.alert(_message);
      } catch (err) {
        if (typeof err === 'string') {
          window.alert(err);
        } else {
          console.error(err);
          window.alert(TEXTS.IMPORT_FILE_GENERIC_ERROR_MESSAGE);
        }
        // analytics
        gtag.event(EventAction.Error, { event_category: EventAction.Import });
      }
    }
    event.target.value = '';
  }, [config, personal, subscriptions]);

  const handleDataSetEditorSave = useCallback((dataSet: Personal) => {
    const confirmed = window.confirm(TEXTS.DATA_SET_EDITOR_SAVE_QUESTION);
    if (confirmed) {
      debug('handleDataSetSave', dataSet);
      dispatch(personalActions.update(dataSet));
      window.alert(TEXTS.DATA_SET_EDITOR_SAVE_SUCCESS);
      handleDataSetEditorModalClose();
    }
  }, [handleDataSetEditorModalClose]);

  return (
    <React.Fragment>
      <small className={lihkgCssClasses.settingSectionTitle}>
        {TEXTS.SETTINGS_EXPORT_IMPORT_SECTION_TITLE}
      </small>
      <ul className={lihkgCssClasses.settingOptionsList}>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <SettingOptionButton onClick={handleEditDataSetButtonClick}>
            {TEXTS.EDIT_DATA_SET_BUTTON_TEXT}
          </SettingOptionButton>
        </li>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <SettingOptionButton onClick={handleExport}>
            {TEXTS.EXPORT_FILE_BUTTON_TEXT}
          </SettingOptionButton>
        </li>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <div>
            <input id={importFileInputId} className={styles.import} type="file" accept="text/json" onChange={handleImport} />
            <label htmlFor={importFileInputId} className={lihkgCssClasses.settingOptionButton}>
              {TEXTS.IMPORT_FILE_BUTTON_TEXT}
            </label>
          </div>
        </li>
      </ul>
      <DataSetEditorModal
        dataSet={personal}
        onSave={handleDataSetEditorSave}
        open={dataSetEditorModalOpened}
        escape={false}
        fragile={false}
        onClose={handleDataSetEditorModalClose}
      />
    </React.Fragment>
  );
};

export default ManageDataSection;
