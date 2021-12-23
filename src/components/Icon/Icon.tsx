import classnames from 'classnames';
import React from 'react';
import { MappedHTMLAttributes } from '../../helpers/types';
import { IconName } from '../../types/icon';

interface IProps {
  icon: IconName;
}

type TProps = IProps & MappedHTMLAttributes<'i'>;

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
