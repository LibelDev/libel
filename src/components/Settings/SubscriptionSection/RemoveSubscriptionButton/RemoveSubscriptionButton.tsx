import classnames from 'classnames';
import { render } from 'mustache';
import React, { useCallback } from 'react';
import { EventAction, EventCategory } from '../../../../constants/ga';
import * as TEXTS from '../../../../constants/texts';
import * as gtag from '../../../../helpers/gtag';
import type { ISubscription } from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import { useTypedDispatch } from '../../../../store/store';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.module.scss';
import * as questions from '../../../../templates/questions';
import { IconName } from '../../../Icon/types';
import IconButton from '../../../IconButton/IconButton';

interface IProps {
  subscription: ISubscription;
  index: number;
}

type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

type TProps = IProps & TComponentProps;

const RemoveSubscriptionButton: React.FunctionComponent<TProps> = (props) => {
  const { className, subscription, index } = props;

  const dispatch = useTypedDispatch();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const question = render(questions.remove.subscription, { subscription });
    const confirmed = window.confirm(question);
    if (confirmed) {
      dispatch(subscriptionsActions.remove(index));
      // analytics
      gtag.event(EventAction.Remove, { event_category: EventCategory.Subscription, event_label: subscription.name });
    }
  }, [subscription, index]);

  return (
    <IconButton
      className={classnames(className, lihkgCssClasses.settingOptionButton)}
      disabled={subscription.loading}
      icon={IconName.Close}
      aria-label={TEXTS.BUTTON_TEXT_REMOVE_SUBSCRIPTION}
      data-tip={TEXTS.BUTTON_TEXT_REMOVE_SUBSCRIPTION}
      title={TEXTS.BUTTON_TEXT_REMOVE_SUBSCRIPTION}
      onClick={handleClick}
    />
  );
};

RemoveSubscriptionButton.displayName = 'RemoveSubscriptionButton';

export default RemoveSubscriptionButton;
