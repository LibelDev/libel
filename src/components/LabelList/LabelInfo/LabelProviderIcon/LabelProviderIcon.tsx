import React from 'react';
import { IBasicSubscription } from '../../../../models/Subscription';
import { IconName } from '../../../../types/icon';
import Icon from '../../../Icon/Icon';

interface IProps {
  subscription: IBasicSubscription;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'a'>;

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
