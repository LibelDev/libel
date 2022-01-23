import React, { useCallback } from 'react';
import { EventAction, EventCategory } from '../../../../constants/ga';
import * as TEXTS from '../../../../constants/texts';
import * as gtag from '../../../../helpers/gtag';
import { prompt } from '../../../../helpers/subscription';
import Subscription from '../../../../models/Subscription';
import { selectSubscriptions } from '../../../../store/selectors';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import { useTypedDispatch, useTypedSelector } from '../../../../store/store';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import { IconName } from '../../../../types/icon';
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
        const subscription = new Subscription('', url, true);
        dispatch(subscriptionsActions.add(subscription));
        dispatch(subscriptionsActions.load(subscriptions.length));
        // analytics
        gtag.event(EventAction.Add, { event_category: EventCategory.Subscription, event_label: subscription.name });
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
      aria-label={TEXTS.ADD_SUBSCRIPTION_BUTTON_TEXT}
      data-tip={TEXTS.ADD_SUBSCRIPTION_BUTTON_TEXT}
      title={TEXTS.ADD_SUBSCRIPTION_BUTTON_TEXT}
      onClick={handleClick}
    >
      {TEXTS.ADD_SUBSCRIPTION_BUTTON_TEXT}
    </IconButton>
  );
};

export default AddSubscriptionButton;
