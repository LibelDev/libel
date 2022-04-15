import classNames from 'classnames';
import debugFactory from 'debug';
import { render } from 'mustache';
import React, { useCallback, useMemo, useState } from 'react';
import { EventAction } from '../../../constants/ga';
import * as TEXTS from '../../../constants/texts';
import { download, _export, _import } from '../../../helpers/file';
import * as gtag from '../../../helpers/gtag';
import * as LIHKG from '../../../helpers/lihkg';
import { mergeConfig, mergeDataSet, mergeSubscriptions } from '../../../helpers/merge';
import Personal from '../../../models/Personal';
import type { ISerializedStorage } from '../../../models/Storage';
import { selectConfig, selectPersonal, selectSubscriptions } from '../../../store/selectors';
import { actions as personalActions } from '../../../store/slices/personal';
import { loadDataIntoStore, useTypedDispatch, useTypedSelector } from '../../../store/store';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import * as messages from '../../../templates/messages';
import BaseInput from '../../BaseInput/BaseInput';
import type { IProps as IDataSetEditorProps } from '../../DataSetEditor/DataSetEditor';
import DataSetEditorModal from '../../DataSetEditorModal/DataSetEditorModal';
import type { IProps as ISubscriptionMakerProps } from '../../SubscriptionMaker/SubscriptionMaker';
import SubscriptionMakerModal from '../../SubscriptionMakerModal/SubscriptionMakerModal';
import SettingOptionButton from '../SettingOptionButton/SettingOptionButton';
import styles from './ManageDataSection.module.scss';

const debug = debugFactory('libel:component:ManageDataSection');

const importInputAccepts = [
  'text/plain',
  '.json',
  '.txt'
];

const ManageDataSection: React.FunctionComponent = () => {
  const dispatch = useTypedDispatch();
  const config = useTypedSelector(selectConfig);
  const personal = useTypedSelector(selectPersonal);
  const subscriptions = useTypedSelector(selectSubscriptions);
  const [isDataSetEditorModalOpened, setIsDataSetEditorModalOpened] = useState(false);
  const [isSubscriptionMakerModalOpened, setIsSubscriptionMakerModalOpened] = useState(false);
  const [isDataSetEditorDirty, setIsDataSetEditorDirty] = useState(false);

  const personalDataUsers = useMemo(() => Object.keys(personal.data), [personal]);

  /* data set editor */
  const handleEditDataSetButtonClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
    event.preventDefault();
    if (personalDataUsers.length > 0) {
      setIsDataSetEditorModalOpened(true);
      setIsDataSetEditorDirty(false);
    } else {
      const notification = LIHKG.createLocalNotification(TEXTS.DATA_SET_EDITOR_MESSAGE_EMPTY_DATA_SET);
      LIHKG.showNotification(notification);
    }
  }, [personalDataUsers]);

  const handleDataSetEditorModalClose = useCallback(() => {
    if (isDataSetEditorDirty) {
      const users = Object.keys(personal.data); // empty data set
      if (users.length > 0) {
        const yes = window.confirm(TEXTS.DATA_SET_EDITOR_MESSAGE_CLOSE_CONFIRMATION);
        if (!yes) {
          return;
        }
      }
    }
    setIsDataSetEditorModalOpened(false);
  }, [personal, isDataSetEditorDirty]);

  const handleDataSetEditorChange: IDataSetEditorProps['onChange'] = useCallback(() => {
    setIsDataSetEditorDirty(true);
  }, []);

  const handleDataSetEditorSubmit: IDataSetEditorProps['onSubmit'] = useCallback((dataSet) => {
    const confirmed = window.confirm(TEXTS.DATA_SET_EDITOR_MESSAGE_SAVE_CONFIRMATION);
    if (confirmed) {
      debug('handleDataSetEditorSubmit', dataSet);
      dispatch(personalActions.update(dataSet));
      setIsDataSetEditorModalOpened(false);
      const notification = LIHKG.createLocalNotification(TEXTS.DATA_SET_EDITOR_MESSAGE_SAVE_SUCCESS);
      LIHKG.showNotification(notification);
    }
  }, []);

  /* subscription maker */
  const handleMakeSubscriptionButtonClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
    event.preventDefault();
    setIsSubscriptionMakerModalOpened(true);
  }, []);

  const handleSubscriptionMakerModalClose = useCallback(() => {
    setIsSubscriptionMakerModalOpened(false);
  }, []);

  const handleSubscriptionMakerSubmit: ISubscriptionMakerProps['onSubmit'] = useCallback((subscription) => {
    const filename = `${subscription.name}.json`;
    const json = JSON.stringify(subscription, null, 2);
    download(filename, json, 'text/plain');
    debug('handleSubscriptionMakerSubmit', json);
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
      const notification = LIHKG.createLocalNotification(message, 5000);
      LIHKG.showNotification(notification);
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
        const incoming = await _import(file);
        const storage: ISerializedStorage = {
          config: mergeConfig(config, incoming.config, false),
          // CAVEAT: ignore `meta` here
          personal: mergeDataSet(personal.plain(), incoming.personal, false),
          subscriptions: mergeSubscriptions(subscriptions, incoming.subscriptions, false)
        };
        // load the merged data into the store
        await loadDataIntoStore(storage);
        // analytics
        gtag.event(EventAction.Import);
        const { users, labels } = Personal.aggregate(incoming.personal);
        const _message = render(messages.success.import, { users, labels, subscriptions: incoming.subscriptions });
        const notification = LIHKG.createLocalNotification(_message, 5000);
        LIHKG.showNotification(notification);
      } catch (err) {
        if (typeof err === 'string') {
          const notification = LIHKG.createLocalNotification(err, 5000);
          LIHKG.showNotification(notification);
        } else {
          console.error(err);
          const notification = LIHKG.createLocalNotification(TEXTS.IMPORT_FILE_ERROR_GENERIC_ERROR, 5000);
          LIHKG.showNotification(notification);
        }
        // analytics
        gtag.event(EventAction.Error, { event_category: EventAction.Import });
      }
    }
    event.target.value = '';
  }, [config, personal, subscriptions]);

  return (
    <React.Fragment>
      <small className={lihkgCssClasses.settingSectionTitle}>
        {TEXTS.SETTINGS_SECTION_TITLE_MANAGE_DATA}
      </small>
      <ul className={lihkgCssClasses.settingOptionsList}>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <SettingOptionButton onClick={handleEditDataSetButtonClick}>
            {TEXTS.BUTTON_TEXT_EDIT_DATA_SET}
          </SettingOptionButton>
        </li>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <SettingOptionButton onClick={handleMakeSubscriptionButtonClick}>
            {TEXTS.BUTTON_TEXT_MAKE_SUBSCRIPTION}
          </SettingOptionButton>
        </li>
        <li className={lihkgCssClasses.settingOptionsItem}>
          <SettingOptionButton onClick={handleExport}>
            {TEXTS.BUTTON_TEXT_EXPORT_FILE}
          </SettingOptionButton>
        </li>
        <li className={classNames(styles.import, lihkgCssClasses.settingOptionsItem)}>
          <BaseInput
            type="file"
            accept={importInputAccepts.join(',')}
            className={styles.input}
            onChange={handleImport}
            label={
              <span className={classNames(styles.label, lihkgCssClasses.settingOptionButton)}>
                {TEXTS.BUTTON_TEXT_IMPORT_FILE}
              </span>
            }
          />
        </li>
      </ul>
      <DataSetEditorModal
        dataSet={personal}
        onChange={handleDataSetEditorChange}
        onSubmit={handleDataSetEditorSubmit}
        open={isDataSetEditorModalOpened}
        escape={false}
        fragile={false}
        onClose={handleDataSetEditorModalClose}
      />
      <SubscriptionMakerModal
        dataSet={personal}
        onSubmit={handleSubscriptionMakerSubmit}
        open={isSubscriptionMakerModalOpened}
        escape={false}
        fragile={false}
        onClose={handleSubscriptionMakerModalClose}
      />
    </React.Fragment>
  );
};

ManageDataSection.displayName = 'ManageDataSection';

export default ManageDataSection;
