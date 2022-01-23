import classnames from 'classnames';
import React from 'react';
import { IconName } from '../../types/icon';

interface IProps {
  icon: IconName;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'i'>;

const Icon: React.FunctionComponent<TProps> = (props) => {
  const { className, icon, ...otherProps } = props;
  return (
    <i
      className={classnames(className, icon)}
      aria-hidden={true}
      {...otherProps}
    />
  );
};

export default Icon;
