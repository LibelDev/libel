import React, { useCallback } from 'react';
import * as TEXTS from '../../../../constants/texts';
import Subscription from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import { useTypedDispatch } from '../../../../store/store';
import ToggleButton from '../../../ToggleButton/ToggleButton';

interface IProps {
  subscription: Subscription;
  index: number;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'button'>;

const ToggleSubscriptionButton: React.FunctionComponent<TProps> = (props) => {
  const { className, subscription, index } = props;

  const dispatch = useTypedDispatch();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked: enabled } = event.target;
    dispatch(subscriptionsActions.toggle({ index, enabled }));
  }, [subscription, index]);

  return (
    <ToggleButton
      simple
      className={className}
      checked={subscription.enabled}
      disabled={subscription.loading}
      onChange={handleChange}
    >
      {subscription.enabled ? TEXTS.BUTTON_TEXT_DISABLE_SUBSCRIPTION : TEXTS.BUTTON_TEXT_ENABLE_SUBSCRIPTION}
    </ToggleButton>
  );
};

ToggleSubscriptionButton.displayName = 'ToggleSubscriptionButton';

export default ToggleSubscriptionButton;
