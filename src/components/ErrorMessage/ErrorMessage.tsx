import type React from 'react';
import { IconName } from '../Icon/types';
import IconMessage, { IProps as IIconMessageProps, TProps as TIconMessageProps } from '../IconMessage/IconMessage';

interface IProps { }

type TComponentProps<T extends React.ElementType> = TComponentPropsWithoutRefWithAs<T, IProps>;

type TProps<T extends React.ElementType> = IProps & TComponentProps<T> & Omit<TIconMessageProps<T>, keyof IIconMessageProps>;

/**
 * @extends IconMessage
 */
function ErrorMessage<T extends React.ElementType> (props: TProps<T>) {
  return (
    <IconMessage
      {...props}
      icon={IconName.CommentAlert}
    />
  );
}

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
