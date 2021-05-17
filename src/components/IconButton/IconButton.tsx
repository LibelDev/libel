import React from 'react';
import BaseIconButton, { TProps as TBaseIconButtonProps } from '../BaseIconButton/BaseIconButton';

interface IProps extends TBaseIconButtonProps<React.ButtonHTMLAttributes<HTMLButtonElement>> { }

const IconButton = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <BaseIconButton {...otherProps} as='button' ref={ref}>
      {children}
    </BaseIconButton>
  );
});

export default IconButton;

export * from '../BaseIconButton/BaseIconButton';

