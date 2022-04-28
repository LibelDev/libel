// import debugFactory from 'debug';
import { render } from 'mustache';
import React, { useCallback } from 'react';
import * as TEXTS from '../../../constants/texts';
import { _export } from '../../../helpers/file';
import * as gtag from '../../../helpers/gtag';
import * as LIHKG from '../../../helpers/lihkg';
import * as messages from '../../../templates/messages';
import { EventAction } from '../../../types/ga';
import SettingOptionButton from '../SettingOptionButton/SettingOptionButton';

// const debug = debugFactory('libel:component:ExportFileButton');

const ExportFileButton: React.FunctionComponent = () => {
  const handleExport: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    try {
      const data = await _export();
      const { personal, subscriptions } = data;
      const { users, labels } = personal.aggregate();
      const message = render(messages.success.export, { users, labels, subscriptions });
      const notification = LIHKG.createLocalNotification(message);
      LIHKG.showNotification(notification);
      // analytics
      gtag.event(EventAction.Export);
    } catch (err) {
      // analytics
      gtag.event(EventAction.Error, { event_category: EventAction.Export });
    }
  }, []);
  return (
    <SettingOptionButton onClick={handleExport}>
      {TEXTS.BUTTON_TEXT_EXPORT_FILE}
    </SettingOptionButton>
  );
};

ExportFileButton.displayName = 'ExportFileButton';

export default ExportFileButton;
