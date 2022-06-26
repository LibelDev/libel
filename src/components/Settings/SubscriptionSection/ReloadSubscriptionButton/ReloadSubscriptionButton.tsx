import classNames from 'classnames';
import type React from 'react';
import { useCallback } from 'react';
import * as TEXTS from '../../../../constants/texts';
import * as gtag from '../../../../helpers/gtag';
import type { ISubscription } from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import { useTypedDispatch } from '../../../../store/store';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.module.scss';
import { EventAction, EventCategory } from '../../../../types/ga';
import { IconName } from '../../../Icon/types';
import IconButton from '../../../IconButton/IconButton';

interface IProps {
  subscription: ISubscription;
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
    gtag.event(EventAction.Reload, {
      event_category: EventCategory.Subscription,
      event_label: subscription.name,
      value: subscription.url
    });
  }, [subscription, index]);

  return (
    <IconButton
      className={classNames(className, lihkgCssClasses.settingOptionButton)}
      disabled={subscription.loading}
      icon={IconName.Refresh}
      aria-label={TEXTS.BUTTON_TEXT_RELOAD_SUBSCRIPTION}
      data-tip={TEXTS.BUTTON_TEXT_RELOAD_SUBSCRIPTION}
      title={TEXTS.BUTTON_TEXT_RELOAD_SUBSCRIPTION}
      onClick={handleClick}
    />
  );
};

ReloadSubscriptionButton.displayName = 'ReloadSubscriptionButton';

export default ReloadSubscriptionButton;
