import classnames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import IconButton, { IconName } from '../../../IconButton/IconButton';
import * as TEXTS from '../../../../constants/texts';
import * as PLACEHOLDERS from '../../../../constants/placeholders';
import Subscription from '../../../../models/Subscription';
import { remove } from '../../../../store/slices/subscriptions';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  subscription: Subscription;
}

const RemoveSubscriptionButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { className, subscription, ...otherProps } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    const question = TEXTS.REMOVE_SUBSCRIPTION_QUESTION
      .replace(PLACEHOLDERS.SUBSCRIPTION_NAME, subscription.name || subscription.url)
      .replace(PLACEHOLDERS.SUBSCRIPTION_URL, subscription.url);
    const confirmed = window.confirm(question);
    if (confirmed) {
      dispatch(remove(subscription));
    }
  };

  return (
    <IconButton
      className={classnames(className, lihkgCssClasses.settingOptionButton)}
      disabled={subscription.loading}
      icon={IconName.Close}
      aria-label={TEXTS.REMOVE_SUBSCRIPTION_BUTTON_TEXT}
      data-tip={TEXTS.REMOVE_SUBSCRIPTION_BUTTON_TEXT}
      title={TEXTS.REMOVE_SUBSCRIPTION_BUTTON_TEXT}
      onClick={handleClick}
      {...otherProps}
    />
  );
};

export default RemoveSubscriptionButton;
