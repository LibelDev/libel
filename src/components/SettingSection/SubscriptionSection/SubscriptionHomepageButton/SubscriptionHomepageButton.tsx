import classnames from 'classnames';
import React from 'react';
import * as TEXTS from '../../../../constants/texts';
import Subscription from '../../../../models/Subscription';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.module.scss';
import { IconName } from '../../../Icon/types';
import IconLink from '../../../IconLink/IconLink';
import styles from './SubscriptionHomepageButton.module.scss';

interface IProps {
  subscription: Subscription;
}

type TComponentProps = React.ComponentPropsWithoutRef<'a'>;

type TProps = IProps & TComponentProps;

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
      aria-label={TEXTS.BUTTON_TEXT_SUBSCRIPTION_HOMEPAGE}
      data-tip={TEXTS.BUTTON_TEXT_SUBSCRIPTION_HOMEPAGE}
      title={TEXTS.BUTTON_TEXT_SUBSCRIPTION_HOMEPAGE}
      {...otherProps}
    />
  );
};

export default SubscriptionHomepageButton;
