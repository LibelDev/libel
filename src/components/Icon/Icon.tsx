import classnames from 'classnames';
import React from 'react';
import { IconName } from '../../types/icon';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  icon: IconName;
}

const Icon: React.FunctionComponent<IProps> = (props) => {
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
