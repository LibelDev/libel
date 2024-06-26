import type React from 'react';
import IconButton, { type TProps as TIconButtonProps } from '../IconButton/IconButton';

interface IProps { }

type TComponentProps = {};

type TProps = IProps & TComponentProps & TIconButtonProps<'a'>;

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
