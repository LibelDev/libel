import React from 'react';
import BaseIconButton, { TProps as TBaseIconButtonProps } from '../BaseIconButton/BaseIconButton';

interface IProps extends TBaseIconButtonProps<React.AnchorHTMLAttributes<HTMLAnchorElement>> { }

const IconLink = React.forwardRef<HTMLAnchorElement, IProps>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <BaseIconButton {...otherProps} as='a' ref={ref}>
      {children}
    </BaseIconButton>
  );
});

export default IconLink;
