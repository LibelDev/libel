import classnames from 'classnames';
import React, { useCallback } from 'react';
import { EventAction, EventCategory } from '../../../../constants/ga';
import * as TEXTS from '../../../../constants/texts';
import * as gtag from '../../../../helpers/gtag';
import Subscription from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import { useTypedDispatch } from '../../../../store/store';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.module.scss';
import { IconName } from '../../../Icon/types';
import IconButton from '../../../IconButton/IconButton';

interface IProps {
  subscription: Subscription;
  index: number;
}

type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

type TProps = IProps & TComponentProps;

const ReloadSubscriptionButton: React.FunctionComponent<TProps> = (props) => {
  const { className, subscription, index } = props;

  const dispatch = useTypedDispatch();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    dispatch(subscriptionsActions.load(index));
    // analytics
    gtag.event(EventAction.Reload, { event_category: EventCategory.Subscription, event_label: subscription.name });
  }, [subscription, index]);

  return (
    <IconButton
      className={classnames(className, lihkgCssClasses.settingOptionButton)}
      disabled={subscription.loading}
      icon={IconName.Refresh}
      aria-label={TEXTS.BUTTON_TEXT_RELOAD_SUBSCRIPTION}
      data-tip={TEXTS.BUTTON_TEXT_RELOAD_SUBSCRIPTION}
      title={TEXTS.BUTTON_TEXT_RELOAD_SUBSCRIPTION}
      onClick={handleClick}
    />
  );
};

export default ReloadSubscriptionButton;
