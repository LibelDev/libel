import React from 'react';
import { IconName } from '../Icon/types';
import IconMessage, { TProps as TIconMessageProps } from '../IconMessage/IconMessage';

interface IProps { }

type TProps = IProps & Omit<TIconMessageProps, 'icon'>;

/**
 * @extends IconMessage
 */
const ErrorMessage: React.FunctionComponent<TProps> = (props) => {
  return (
    <IconMessage
      {...props}
      icon={IconName.CommentAlert}
    />
  );
};

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
