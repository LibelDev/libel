import React from 'react';
import IconButton, { TProps as TIconButtonProps } from '../IconButton/IconButton';

interface IProps { }

type TProps = IProps & TIconButtonProps & {};

type TPropsAsAnchor = TProps & { as: 'a'; };

const IconLink: React.FunctionComponent<TProps> = (props) => {
  return (
    <IconButton
      {...props as TPropsAsAnchor}
      as="a"
    />
  );
};

IconLink.displayName = 'IconLink';

export default IconLink;
