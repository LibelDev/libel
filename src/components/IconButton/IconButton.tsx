import React from 'react';
import BaseIconButton, { TProps as TBaseIconButtonProps } from '../BaseIconButton/BaseIconButton';
import Button from '../Button/Button';

interface IProps extends TBaseIconButtonProps<React.ButtonHTMLAttributes<HTMLButtonElement>> { }

const IconButton = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <BaseIconButton {...otherProps} as={Button} ref={ref}>
      {children}
    </BaseIconButton>
  );
});

export default IconButton;
