import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import { prompt } from '../../../../helpers/subscription';
import Subscription from '../../../../models/Subscription';
import { selectSubscriptions } from '../../../../store/selectors';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import { IconName } from '../../../../types/icon';
import IconButton from '../../../IconButton/IconButton';

const AddSubscriptionButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const subscriptions = useSelector(selectSubscriptions) as Subscription[];

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(async (event) => {
    event.preventDefault();
    const url = (prompt() || '').trim();
    const subscription = subscriptions.find((subscription) => subscription.url === url);
    if (!subscription) {
      const subscription = new Subscription('', url, true);
      dispatch(subscriptionsActions.add(subscription));
      dispatch(subscriptionsActions.load(subscription));
    } else {
      // already subscribed, simply load the remote data again
      dispatch(subscriptionsActions.load(subscription));
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
