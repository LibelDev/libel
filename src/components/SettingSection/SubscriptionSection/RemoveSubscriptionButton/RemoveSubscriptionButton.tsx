import classnames from 'classnames';
import { render } from 'mustache';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import { MappedHTMLAttributes } from '../../../../helpers/types';
import Subscription from '../../../../models/Subscription';
import { actions as subscriptionsActions } from '../../../../store/slices/subscriptions';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import * as questions from '../../../../templates/questions';
import { IconName } from '../../../../types/icon';
import IconButton from '../../../IconButton/IconButton';

interface IProps {
  subscription: Subscription;
  index: number;
}

type TProps = IProps & MappedHTMLAttributes<'button'>;

const RemoveSubscriptionButton: React.FunctionComponent<TProps> = (props) => {
  const dispatch = useDispatch();
  const { className, subscription, index } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const question = render(questions.remove.subscription, { subscription });
    const confirmed = window.confirm(question);
    if (confirmed) {
      dispatch(subscriptionsActions.remove(index));
    }
  }, [subscription, index]);

  return (
    <IconButton
      className={classnames(className, lihkgCssClasses.settingOptionButton)}
      disabled={subscription.loading}
      icon={IconName.Close}
      aria-label={TEXTS.REMOVE_SUBSCRIPTION_BUTTON_TEXT}
      data-tip={TEXTS.REMOVE_SUBSCRIPTION_BUTTON_TEXT}
      title={TEXTS.REMOVE_SUBSCRIPTION_BUTTON_TEXT}
      onClick={handleClick}
    />
  );
};

export default RemoveSubscriptionButton;
