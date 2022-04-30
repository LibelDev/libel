import classNames from 'classnames';
import type React from 'react';
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
    as: Component = 'button',
    className,
    disabled,
    loading,
    children,
    ...otherProps
  } = props;

  const _props = {
    ...otherProps,
    className: classNames(className, styles.baseButton),
    disabled: disabled || loading
  };

  return (
    <Component {..._props as TAnchorComponentProps & TButtonComponentProps}>
      {children}
      {
        loading && (
          <LoadingSpinner className={styles.loadingSpinner} />
        )
      }
    </Component>
  );
};

BaseButton.displayName = 'BaseButton';

export default BaseButton;
