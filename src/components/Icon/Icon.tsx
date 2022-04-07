import classnames from 'classnames';
import React from 'react';
import type { IconName } from './types';

interface IProps {
  icon: IconName;
}

type TComponentProps = React.ComponentPropsWithoutRef<'i'>;

type TProps = IProps & TComponentProps;

const Icon: React.FunctionComponent<TProps> = (props) => {
  const { className, icon, ...otherProps } = props;
  return (
    <i
      className={classnames(className, icon)}
      aria-hidden
      {...otherProps}
    />
  );
};

Icon.displayName = 'Icon';

export default Icon;
