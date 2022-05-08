import classNames from 'classnames';
import type React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './BaseButton.module.scss';

interface IProps {
  disabled?: boolean;
  loading?: boolean;
}

type TComponentProps<T extends React.ElementType> = TComponentPropsWithoutRefWithAs<T, IProps>;

export type TProps<T extends React.ElementType = 'button'> = IProps & TComponentProps<T>;

function BaseButton<T extends React.ElementType> (props: TProps<T>) {
  const {
    className,
    as,
    disabled,
    loading,
    children,
    ...otherProps
  } = props;

  const Component = as || 'button';

  return (
    <Component
      {...otherProps}
      className={
        classNames(
          className,
          styles.baseButton
        )
      }
      disabled={disabled || loading}
    >
      {children}
      {
        loading && (
          <LoadingSpinner className={styles.loadingSpinner} />
        )
      }
    </Component>
  );
}

BaseButton.displayName = 'BaseButton';

export default BaseButton;
