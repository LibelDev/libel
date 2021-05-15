import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PLACEHOLDERS from '../../../../constants/placeholders';
import * as TEXTS from '../../../../constants/texts';
import { prompt } from '../../../../helpers/subscription';
import Subscription from '../../../../models/Subscription';
import { selectSubscriptions } from '../../../../store/selectors';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import IconButton, { IconName } from '../../../IconButton/IconButton';

const AddSubscriptionButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const subscriptions = useSelector(selectSubscriptions);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(async (event) => {
    event.preventDefault();
    const url = prompt();
    if (url) {
      const _url = url.trim();
      const subscription = subscriptions.find((subscription) => subscription.url === _url);
      if (!subscription) {
        const subscription = new Subscription('', _url, true);
        dispatch(subscriptionsActions.add(subscription));
        dispatch(subscriptionsActions.load(subscriptions.length));
      } else {
        const message = TEXTS.ADD_SUBSCRIPTION_ALREADY_SUBSCRIBED_ERROR
          .replace(PLACEHOLDERS.SUBSCRIPTION_NAME, subscription.name || subscription.url)
          .replace(PLACEHOLDERS.SUBSCRIPTION_URL, subscription.url);
        window.alert(message);
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
