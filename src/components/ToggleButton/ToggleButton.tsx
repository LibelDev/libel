import classNames from 'classnames';
import type React from 'react';
import { forwardRef, useId } from 'react';
import BaseInput, { type TProps as TBaseInputProps } from '../BaseInput/BaseInput';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './ToggleButton.module.scss';

interface IProps {
  /**
   * show loading spinner
   */
  loading?: boolean;
  /**
   * display the switch button only
   */
  simple?: boolean;
  /**
   * use small button
   */
  small?: boolean;
  /**
   * label on the right, button on left
   */
  flip?: boolean;
}

type TProps = IProps & TBaseInputProps;

const ToggleButton = forwardRef<HTMLInputElement, TProps>((props, ref) => {
  const { id, className, children, checked, disabled, loading, simple, small, flip, ...otherProps } = props;

  const _id = id || useId();

  return (
    <div
      className={
        classNames(
          className,
          styles.toggleButton,
          {
            [styles.checked]: checked,
            [styles.disabled]: disabled || loading,
            [styles.simple]: simple,
            [styles.small]: small,
            [styles.flip]: flip,
          }
        )
      }
    >
      <label htmlFor={_id}>
        {children}
        {
          loading && (
            <LoadingSpinner className={styles.loadingSpinner} />
          )
        }
      </label>
      <BaseInput
        {...otherProps}
        ref={ref}
        id={_id}
        className={styles.input}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled || loading}
      />
      <div
        className={styles.button}
        aria-hidden
      />
    </div>
  );
});

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
