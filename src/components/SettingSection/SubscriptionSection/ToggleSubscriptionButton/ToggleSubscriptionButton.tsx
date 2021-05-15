import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import Subscription from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import ToggleButton from '../../../ToggleButton/ToggleButton';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  subscription: Subscription;
  index: number;
}

const ToggleSubscriptionButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { className, subscription, index } = props;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked: enabled } = event.target;
    dispatch(subscriptionsActions.toggle({ index, enabled }));
  }, [subscription, index]);

  return (
    <ToggleButton
      className={className}
      checked={subscription.enabled}
      disabled={subscription.loading}
      onChange={handleChange}
    >
      {subscription.enabled ? TEXTS.DISABLE_SUBSCRIPTION_BUTTON_TEXT : TEXTS.ENABLE_SUBSCRIPTION_BUTTON_TEXT}
    </ToggleButton>
  );
};

export default ToggleSubscriptionButton;
