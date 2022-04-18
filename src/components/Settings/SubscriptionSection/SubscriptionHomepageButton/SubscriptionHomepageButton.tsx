import classNames from 'classnames';
import type React from 'react';
import * as TEXTS from '../../../../constants/texts';
import type { ISubscription } from '../../../../models/Subscription';
import lihkgCssClasses from '../../../../stylesheets/variables/lihkg/classes.module.scss';
import { IconName } from '../../../Icon/types';
import IconLink from '../../../IconLink/IconLink';
import styles from './SubscriptionHomepageButton.module.scss';

interface IProps {
  subscription: ISubscription;
}

type TComponentProps = React.ComponentPropsWithoutRef<'a'>;

type TProps = IProps & TComponentProps;

const SubscriptionHomepageButton: React.FunctionComponent<TProps> = (props) => {
  const { className, subscription, ...otherProps } = props;
  const { homepage, loading } = subscription;
  const disabled = loading || !homepage;
  return (
    <IconLink
      className={
        classNames(
          className,
          lihkgCssClasses.settingOptionButton,
          styles.subscriptionHomepageButton
        )
      }
      icon={IconName.Link}
      href={!disabled ? homepage : undefined}
      target="_blank"
      disabled={disabled}
      aria-label={TEXTS.BUTTON_TEXT_SUBSCRIPTION_HOMEPAGE}
      data-tip={TEXTS.BUTTON_TEXT_SUBSCRIPTION_HOMEPAGE}
      title={TEXTS.BUTTON_TEXT_SUBSCRIPTION_HOMEPAGE}
      {...otherProps}
    />
  );
};

SubscriptionHomepageButton.displayName = 'SubscriptionHomepageButton';

export default SubscriptionHomepageButton;
