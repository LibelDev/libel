import React from 'react';
import BaseIconButton, { TProps as TBaseIconButtonProps } from '../BaseIconButton/BaseIconButton';

interface IProps extends TBaseIconButtonProps<React.AnchorHTMLAttributes<HTMLAnchorElement>> {
  disabled?: boolean;
}

const IconLink = React.forwardRef<HTMLAnchorElement, IProps>((props, ref) => {
  const { disabled, children, ...otherProps } = props;
  return (
    <BaseIconButton {...otherProps} as='a' ref={ref} disabled={disabled}>
      {children}
    </BaseIconButton>
  );
});

export default IconLink;

export * from '../BaseIconButton/BaseIconButton';

