import React from 'react';
import Subscription from '../../../../models/Subscription';
import { IconName } from '../../../../types/icon';
import Icon from '../../../Icon/Icon';

interface IProps extends React.HTMLAttributes<HTMLAnchorElement> {
  subscription: Subscription;
}

const LabelProviderIcon: React.FunctionComponent<IProps> = (props) => {
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
