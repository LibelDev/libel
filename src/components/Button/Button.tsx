import classNames from 'classnames';
import React from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './Button.scss';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { className, children, loading, ...otherProps } = props;
  return (
    <button
      ref={ref}
      className={classNames(className, styles.button)}
      disabled={loading}
      {...otherProps}
    >
      {
        loading ? (
          <LoadingSpinner />
        ) : (
          children
        )
      }
    </button>
  );
});

export default Button;
