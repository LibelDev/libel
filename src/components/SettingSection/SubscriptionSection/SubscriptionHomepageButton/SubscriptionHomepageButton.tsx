import classnames from 'classnames';
import React from 'react';
import * as TEXTS from '../../../../constants/texts';
import Subscription from '../../../../models/Subscription';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.module.scss';
import { IconName } from '../../../../types/icon';
import IconLink from '../../../IconLink/IconLink';
import styles from './SubscriptionHomepageButton.module.scss';

interface IProps  {
  subscription: Subscription;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'a'>

const SubscriptionHomepageButton: React.FunctionComponent<TProps> = (props) => {
  const { className, subscription, ...otherProps } = props;
  const { homepage, loading } = subscription;
  return (
    <IconLink
      className={
        classnames(
          className,
          lihkgCssClasses.settingOptionButton,
          styles.subscriptionHomepageButton
        )
      }
      icon={IconName.Link}
      href={homepage}
      target="_blank"
      disabled={loading || !homepage}
      aria-label={TEXTS.SUBSCRIPTION_HOMEPAGE_BUTTON_TEXT}
      data-tip={TEXTS.SUBSCRIPTION_HOMEPAGE_BUTTON_TEXT}
      title={TEXTS.SUBSCRIPTION_HOMEPAGE_BUTTON_TEXT}
      {...otherProps}
    />
  );
};

export default SubscriptionHomepageButton;
