import classNames from 'classnames';
import React from 'react';
import BaseInput, { TProps as IBaseInputProps } from '../BaseInput/BaseInput';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './ToggleButton.scss';

interface IProps {
  /**
   * show loading spinner
   */
  loading?: boolean;
  /**
  * no label, button only
  */
  simple?: boolean;
}

type TProps = IProps & IBaseInputProps;

const ToggleButton: React.FunctionComponent<TProps> = (props) => {
  const { className, children, checked, disabled, loading, simple, ...otherProps } = props;

  return (
    <div
      className={
        classNames(
          className,
          styles.toggleButton,
          {
            [styles.checked]: checked,
            [styles.disabled]: disabled || loading,
            [styles.simple]: simple
          }
        )
      }
    >
      <BaseInput
        type="checkbox"
        checked={checked}
        disabled={disabled || loading}
        label={
          <span>
            {children}
            {
              loading && (
                <LoadingSpinner className={styles.loadingSpinner} />
              )
            }
          </span>
        }
        {...otherProps}
      />
      <div
        className={styles.button}
        aria-hidden
      />
    </div>
  );
};

export default ToggleButton;
