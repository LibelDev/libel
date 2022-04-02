import classNames from 'classnames';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './BaseButton.module.scss';

interface IProps {
  disabled?: boolean;
  loading?: boolean;
}

type TAnchorComponentProps = React.ComponentPropsWithoutRef<'a'>;
type TButtonComponentProps = React.ComponentPropsWithoutRef<'button'>;

type TComponentPropsWithAs<K extends keyof JSX.IntrinsicElements> = {
  as?: K;
} & React.ComponentPropsWithoutRef<K>;

type TAnchorComponentPropsWithAs = TComponentPropsWithAs<'a'>;
type TButtonComponentPropsWithAs = TComponentPropsWithAs<'button'>;

export type TProps = IProps & (
  TAnchorComponentPropsWithAs |
  TButtonComponentPropsWithAs
);

const BaseButton: React.FunctionComponent<TProps> = (props) => {
  const {
    className,
    children,
    disabled,
    loading,
    as = 'button',
    ...otherProps
  } = props;
  const _props = {
    ...otherProps,
    className: classNames(className, styles.baseButton),
    disabled: disabled || loading
  };
  const _children = (
    loading ? (
      <LoadingSpinner />
    ) : (
      children
    )
  );
  return React.createElement(as, _props as TAnchorComponentProps & TButtonComponentProps, _children);
};

export default BaseButton;
