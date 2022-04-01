import React from 'react';
import type { IBasicSubscription } from '../../models/Subscription';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';

interface IProps {
  subscription: IBasicSubscription;
}

type TComponentProps = React.ComponentPropsWithoutRef<'a'>;

type TProps = IProps & TComponentProps;

const LabelProviderIcon: React.FunctionComponent<TProps> = (props) => {
  const { className, subscription } = props;
  const { name, homepage } = subscription;
  return (
    <a
      className={className}
      href={homepage}
      target="_blank"
      aria-label={name}
      data-tip={name}
      title={name}
    >
      <Icon icon={IconName.InfoFill} />
    </a>
  );
};

export default LabelProviderIcon;
