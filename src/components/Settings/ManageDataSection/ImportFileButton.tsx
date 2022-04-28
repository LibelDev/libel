// import debugFactory from 'debug';
import { render } from 'mustache';
import type React from 'react';
import { useCallback } from 'react';
import * as TEXTS from '../../../constants/texts';
import { _import } from '../../../helpers/file';
import * as gtag from '../../../helpers/gtag';
import * as LIHKG from '../../../helpers/lihkg';
import { mergeConfig, mergeDataSet, mergeSubscriptions } from '../../../helpers/merge';
import Personal from '../../../models/Personal';
import type { ISerializedStorage } from '../../../models/Storage';
import { selectConfig, selectPersonal, selectSubscriptions } from '../../../store/selectors';
import { loadDataIntoStore, useTypedSelector } from '../../../store/store';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import * as messages from '../../../templates/messages';
import { EventAction } from '../../../types/ga';
import FileInput from '../../FileInput/FileInput';

// const debug = debugFactory('libel:component:ImportFileButton');

const accepts = [
  'text/plain',
  '.json',
  '.txt'
];

const ImportFileButton: React.FunctionComponent = () => {
  const config = useTypedSelector(selectConfig);
  const personal = useTypedSelector(selectPersonal);
  const subscriptions = useTypedSelector(selectSubscriptions);

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
        const { users, labels } = Personal.aggregate(incoming.personal);
        const _message = render(messages.success.import, { users, labels, subscriptions: incoming.subscriptions });
        const notification = LIHKG.createLocalNotification(_message);
        LIHKG.showNotification(notification);
        // analytics
        gtag.event(EventAction.Import);
      } catch (err) {
        if (typeof err === 'string') {
          const notification = LIHKG.createLocalNotification(err);
          LIHKG.showNotification(notification);
        } else {
          console.error(err);
          const notification = LIHKG.createLocalNotification(TEXTS.IMPORT_FILE_ERROR_GENERIC_ERROR);
          LIHKG.showNotification(notification);
        }
        // analytics
        gtag.event(EventAction.Error, { event_category: EventAction.Import });
      }
    }
    event.target.value = '';
  }, [config, personal, subscriptions]);

  return (
    <FileInput
      accept={accepts.join(',')}
      onChange={handleImport}
    >
      <span className={lihkgCssClasses.settingOptionButton}>
        {TEXTS.BUTTON_TEXT_IMPORT_FILE}
      </span>
    </FileInput>
  );
};

ImportFileButton.displayName = 'ImportFileButton';

export default ImportFileButton;
