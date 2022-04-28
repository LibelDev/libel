// import debugFactory from 'debug';
import React, { useCallback, useState } from 'react';
import * as TEXTS from '../../../constants/texts';
import { download } from '../../../helpers/file';
import useSettingsModalFocusTrap from '../../../hooks/useSettingsModalFocusTrap';
import { selectPersonal } from '../../../store/selectors';
import { useTypedSelector } from '../../../store/store';
import type { IProps as ISubscriptionMakerProps } from '../../SubscriptionMaker/SubscriptionMaker';
import SubscriptionMakerModal from '../../SubscriptionMakerModal/SubscriptionMakerModal';
import SettingOptionButton from '../SettingOptionButton/SettingOptionButton';

// const debug = debugFactory('libel:component:MakeSubscriptionButton');

const MakeSubscriptionButton: React.FunctionComponent = () => {
  const personal = useTypedSelector(selectPersonal);
  const [open, setOpen] = useState(false);
  const settingsModalFocusTrap = useSettingsModalFocusTrap();

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
    event.preventDefault();
    settingsModalFocusTrap?.pause();
    window.requestAnimationFrame(() => {
      setOpen(true);
    });
  }, [settingsModalFocusTrap]);

  const handleClose = useCallback(() => {
    settingsModalFocusTrap?.unpause();
    window.requestAnimationFrame(() => {
      setOpen(false);
    });
  }, [settingsModalFocusTrap]);

  const handleSubmit: ISubscriptionMakerProps['onSubmit'] = useCallback((subscription) => {
    const filename = `${subscription.name}.json`;
    const json = JSON.stringify(subscription, null, 2);
    download(filename, json, 'text/plain');
    // debug('handleSubscriptionMakerSubmit', json);
  }, []);

  return (
    <React.Fragment>
      <SettingOptionButton onClick={handleClick}>
        {TEXTS.BUTTON_TEXT_MAKE_SUBSCRIPTION}
      </SettingOptionButton>
      <SubscriptionMakerModal
        dataSet={personal}
        onSubmit={handleSubmit}
        open={open}
        escape={false}
        fragile={false}
        onClose={handleClose}
      />
    </React.Fragment>
  );
};

MakeSubscriptionButton.displayName = 'MakeSubscriptionButton';

export default MakeSubscriptionButton;
