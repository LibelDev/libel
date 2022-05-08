import type React from 'react';
import IconButton, { TProps as TIconButtonProps } from '../IconButton/IconButton';

interface IProps { }

type TComponentProps = {};

type TProps = IProps & TComponentProps & Omit<TIconButtonProps<'a'>, 'as'>;

/**
 * @extends IconButton
 */
const IconLink: React.FunctionComponent<TProps> = (props) => {
  return (
    <IconButton
      {...props}
      as="a"
    />
  );
};

IconLink.displayName = 'IconLink';

export default IconLink;
