// import debugFactory from 'debug';
import type React from 'react';
import { useCallback, useState } from 'react';
import * as TEXTS from '../../../constants/texts';
import { download } from '../../../helpers/file';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { selectPersonal } from '../../../store/selectors';
import { useTypedSelector } from '../../../store/store';
import type { IProps as ISubscriptionMakerProps } from '../../SubscriptionMaker/SubscriptionMaker';
import SubscriptionMakerModal from '../../SubscriptionMakerModal/SubscriptionMakerModal';
import SettingOptionButton from '../SettingOptionButton/SettingOptionButton';

// const debug = debugFactory('libel:component:MakeSubscriptionButton');

const MakeSubscriptionButton: React.FunctionComponent = () => {
  const personal = useTypedSelector(selectPersonal);
  const [open, setOpen] = useState(false);
  const focusTrap = useFocusTrap();

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
    event.preventDefault();
    focusTrap?.pause();
    window.requestAnimationFrame(() => {
      setOpen(true);
    });
  }, [focusTrap]);

  const handleClose = useCallback(() => {
    focusTrap?.unpause();
    window.requestAnimationFrame(() => {
      setOpen(false);
    });
  }, [focusTrap]);

  const handleSubmit: ISubscriptionMakerProps['onSubmit'] = useCallback((subscription) => {
    const filename = `${subscription.name}.json`;
    const json = JSON.stringify(subscription, null, 2);
    download(filename, json, 'text/plain');
    // debug('handleSubscriptionMakerSubmit', json);
  }, []);

  return (
    <>
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
    </>
  );
};

MakeSubscriptionButton.displayName = 'MakeSubscriptionButton';

export default MakeSubscriptionButton;
