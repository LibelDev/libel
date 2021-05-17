import classnames from 'classnames';
import React from 'react';
import * as TEXTS from '../../../../constants/texts';
import Subscription from '../../../../models/Subscription';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.scss';
import Icon, { IconName } from '../../../Icon/Icon';
import styles from './SubscriptionHomepageButton.scss';

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  subscription: Subscription;
}

const SubscriptionHomepageButton: React.FunctionComponent<IProps> = (props) => {
  const { className, subscription, ...otherProps } = props;

  return subscription.homepage ? (
    <a
      className={
        classnames(className,
          lihkgCssClasses.settingOptionButton,
          styles.subscriptionHomepageButton
        )
      }
      href={subscription.homepage}
      target="_blank"
      aria-label={TEXTS.SUBSCRIPTION_HOMEPAGE_BUTTON_TEXT}
      data-tip={TEXTS.SUBSCRIPTION_HOMEPAGE_BUTTON_TEXT}
      title={TEXTS.SUBSCRIPTION_HOMEPAGE_BUTTON_TEXT}
      {...otherProps}
    >
      <Icon icon={IconName.Link} />
    </a>
  ) : null;
};

export default SubscriptionHomepageButton;
