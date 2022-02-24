import classNames from 'classnames';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './BaseButton.module.scss';

interface IProps {
  disabled?: boolean;
  loading?: boolean;
}

type TAnchorHTMLAttributes = React.ComponentPropsWithoutRef<'a'>;
type TButtonHTMLAttributes = React.ComponentPropsWithoutRef<'button'>;

type HTMLAttributesWithAs<K extends keyof JSX.IntrinsicElements> = {
  as?: K;
} & React.ComponentPropsWithoutRef<K>;

type AnchorHTMLAttributesWithAs = HTMLAttributesWithAs<'a'>;
type ButtonHTMLAttributesWithAs = HTMLAttributesWithAs<'button'>;

export type TProps = IProps & (
  AnchorHTMLAttributesWithAs |
  ButtonHTMLAttributesWithAs
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
  return React.createElement(as, _props as TAnchorHTMLAttributes & TButtonHTMLAttributes, _children);
};

export default BaseButton;
