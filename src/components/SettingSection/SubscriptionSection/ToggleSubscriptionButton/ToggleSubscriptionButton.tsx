import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import { MappedHTMLAttributes } from '../../../../helpers/types';
import Subscription from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import ToggleButton from '../../../ToggleButton/ToggleButton';

interface IProps {
  subscription: Subscription;
}

type TProps = IProps & MappedHTMLAttributes<'button'>;

const ToggleSubscriptionButton: React.FunctionComponent<TProps> = (props) => {
  const dispatch = useDispatch();
  const { className, subscription } = props;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked: enabled } = event.target;
    dispatch(subscriptionsActions.toggle({ subscription, enabled }));
  }, [subscription, subscription]);

  return (
    <ToggleButton
      simple
      className={className}
      checked={subscription.enabled}
      disabled={subscription.loading}
      onChange={handleChange}
    >
      {subscription.enabled ? TEXTS.DISABLE_SUBSCRIPTION_BUTTON_TEXT : TEXTS.ENABLE_SUBSCRIPTION_BUTTON_TEXT}
    </ToggleButton>
  );
};

ToggleSubscriptionButton.displayName = 'ToggleSubscriptionButton';

export default ToggleSubscriptionButton;
