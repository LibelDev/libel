import type React from 'react';
import { useCallback } from 'react';
import * as TEXTS from '../../../../constants/texts';
import { getElementLabelTipProps } from '../../../../helpers/common';
import * as gtag from '../../../../helpers/gtag';
import { prompt } from '../../../../helpers/subscription';
import Subscription from '../../../../models/Subscription';
import { selectSubscriptions } from '../../../../store/selectors';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import { useTypedDispatch, useTypedSelector } from '../../../../store/store';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.module.scss';
import { EventAction, EventCategory } from '../../../../types/ga';
import { IconName } from '../../../Icon/types';
import IconButton from '../../../IconButton/IconButton';

const AddSubscriptionButton: React.FunctionComponent = () => {
  const dispatch = useTypedDispatch();
  const subscriptions = useTypedSelector(selectSubscriptions);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(async (event) => {
    event.preventDefault();
    const url = (prompt() || '').trim();
    if (url) {
      const subscription = subscriptions.find((subscription) => subscription.url === url);
      if (!subscription) {
        const subscription = new Subscription('', '', url, true);
        dispatch(subscriptionsActions.add(subscription));
        dispatch(subscriptionsActions.load(subscriptions.length));
        // analytics
        gtag.event(EventAction.Add, {
          event_category: EventCategory.Subscription,
          event_label: subscription.name,
          value: subscription.url
        });
      } else {
        // already subscribed, simply load the remote data again
        const index = subscriptions.indexOf(subscription);
        dispatch(subscriptionsActions.load(index));
      }
    }
  }, [subscriptions]);

  return (
    <IconButton
      className={lihkgCssClasses.settingOptionButton}
      icon={IconName.Plus}
      {...getElementLabelTipProps(TEXTS.BUTTON_TEXT_ADD_SUBSCRIPTION)}
      onClick={handleClick}
    >
      {TEXTS.BUTTON_TEXT_ADD_SUBSCRIPTION}
    </IconButton>
  );
};

AddSubscriptionButton.displayName = 'AddSubscriptionButton';

export default AddSubscriptionButton;
