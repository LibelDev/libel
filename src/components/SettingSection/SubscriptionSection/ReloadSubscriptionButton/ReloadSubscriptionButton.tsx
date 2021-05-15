import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import Subscription from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import { IconName } from '../../../Icon/Icon';
import IconButton from '../../../IconButton/IconButton';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  subscription: Subscription;
  index: number;
}

const ReloadSubscriptionButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { className, subscription, index, ...otherProps } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    dispatch(subscriptionsActions.load(index));
  }, [subscription, index]);

  return (
    <IconButton
      className={lihkgCssClasses.settingOptionButton}
      disabled={subscription.loading}
      icon={IconName.Refresh}
      aria-label={TEXTS.RELOAD_SUBSCRIPTION_BUTTON_TEXT}
      data-tip={TEXTS.RELOAD_SUBSCRIPTION_BUTTON_TEXT}
      title={TEXTS.RELOAD_SUBSCRIPTION_BUTTON_TEXT}
      onClick={handleClick}
      {...otherProps}
    />
  );
};

export default ReloadSubscriptionButton;
