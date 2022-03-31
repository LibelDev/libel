import React from 'react';
import { IconName } from '../Icon/types';
import IconMessage, { TComponentProps as TIconMessageComponentProps } from '../IconMessage/IconMessage';

interface IProps { }

type TComponentProps = TIconMessageComponentProps;

type TProps = IProps & TComponentProps;

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
