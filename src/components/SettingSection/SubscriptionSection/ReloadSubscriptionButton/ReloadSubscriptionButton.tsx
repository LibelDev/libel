import classnames from 'classnames';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import { MappedHTMLAttributes } from '../../../../helpers/types';
import Subscription from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import { IconName } from '../../../../types/icon';
import IconButton from '../../../IconButton/IconButton';

interface IProps {
  subscription: Subscription;
  index: number;
}

type TProps = IProps & MappedHTMLAttributes<'button'>

const ReloadSubscriptionButton: React.FunctionComponent<TProps> = (props) => {
  const dispatch = useDispatch();
  const { className, subscription, index } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    dispatch(subscriptionsActions.load(index));
  }, [subscription, index]);

  return (
    <IconButton
      className={classnames(className, lihkgCssClasses.settingOptionButton)}
      disabled={subscription.loading}
      icon={IconName.Refresh}
      aria-label={TEXTS.RELOAD_SUBSCRIPTION_BUTTON_TEXT}
      data-tip={TEXTS.RELOAD_SUBSCRIPTION_BUTTON_TEXT}
      title={TEXTS.RELOAD_SUBSCRIPTION_BUTTON_TEXT}
      onClick={handleClick}
    />
  );
};

export default ReloadSubscriptionButton;
