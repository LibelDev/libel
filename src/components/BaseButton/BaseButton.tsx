import classNames from 'classnames';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './BaseButton.scss';

interface IProps {
  disabled?: boolean;
  loading?: boolean;
}

type HTMLAttributes<K extends keyof JSX.IntrinsicElements> = (
  JSX.IntrinsicElements[K] extends React.DetailedHTMLProps<infer A, any> ? (
    A
  ) : never
);

type HTMLAttributesWithIs<K extends keyof JSX.IntrinsicElements> = {
  as?: K;
} & HTMLAttributes<K>;

type AnchorHTMLAttributes = HTMLAttributes<'a'>;
type ButtonHTMLAttributes = HTMLAttributes<'button'>;

type MixedHTMLAttributes = AnchorHTMLAttributes & ButtonHTMLAttributes;

type AnchorHTMLAttributesWithIs = HTMLAttributesWithIs<'a'>;
type ButtonHTMLAttributesWithIs = HTMLAttributesWithIs<'button'>;

export type TProps = IProps & (
  AnchorHTMLAttributesWithIs |
  ButtonHTMLAttributesWithIs
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
  return React.createElement(as, _props as MixedHTMLAttributes, _children);
};

export default BaseButton;
