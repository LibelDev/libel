import classnames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import ToggleButton from '../../../ToggleButton/ToggleButton';
import * as TEXTS from '../../../../constants/texts';
import Subscription from '../../../../models/Subscription';
import { remove, toggle } from '../../../../store/slices/subscriptions';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  subscription: Subscription;
}

const ToggleSubscriptionButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { className, subscription } = props;

  const handleToggle = (subscription: Subscription, enabled: boolean) => {
    dispatch(toggle({ subscription, enabled }));
  };

  return (
    <ToggleButton
      className={classnames(className)}
      disabled={subscription.loading}
      defaultChecked={subscription.enabled}
      onChange={(event) => handleToggle(subscription, event.target.checked)}
    >
      {subscription.enabled ? TEXTS.DISABLE_SUBSCRIPTION_BUTTON_TEXT : TEXTS.ENABLE_SUBSCRIPTION_BUTTON_TEXT}
    </ToggleButton>
  );
};

export default ToggleSubscriptionButton;
