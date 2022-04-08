import React from 'react';
import type { IBasicSubscription } from '../../models/Subscription';
import { IconName } from '../Icon/types';
import IconLink from '../IconLink/IconLink';

interface IProps {
  subscription: IBasicSubscription;
}

type TComponentProps = React.ComponentPropsWithoutRef<'a'>;

type TProps = IProps & TComponentProps;

const LabelProviderButton: React.FunctionComponent<TProps> = (props) => {
  const { subscription, ...otherProps } = props;
  const { name, homepage } = subscription;
  return (
    <IconLink
      {...otherProps}
      icon={IconName.InfoFill}
      href={homepage}
      target="_blank"
      aria-label={name}
      data-tip={name}
      title={name}
    />
  );
};

LabelProviderButton.displayName = 'LabelProviderButton';

export default LabelProviderButton;
