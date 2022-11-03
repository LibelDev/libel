import type React from 'react';
import type { ISubscription } from '../../models/Subscription';
import { IconName } from '../Icon/types';
import IconLink from '../IconLink/IconLink';

/**
 * original props
 */
interface IProps {
  subscription: ISubscription;
}

/**
 * component props for the element type `a`
 */
type TComponentProps = TComponentPropsWithoutRef<'a', IProps>;

/**
 * `LabelSubscriptionButton` props
 */
type TProps = IProps & TComponentProps;

const LabelSubscriptionButton: React.FunctionComponent<TProps> = (props) => {
  const { subscription, ...otherProps } = props;
  return (
    <IconLink
      icon={IconName.InfoFill}
      href={subscription.url}
      target="_blank"
      aria-label={subscription.name}
      data-tip={subscription.name}
      title={subscription.name}
      {...otherProps}
    />
  );
};

LabelSubscriptionButton.displayName = 'LabelSubscriptionButton';

export default LabelSubscriptionButton;
