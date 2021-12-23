import classNames from 'classnames';
import React from 'react';
import BaseInput, { TProps as IBaseInputProps } from '../BaseInput/BaseInput';
import styles from './ToggleButton.scss';

interface IProps {
  /**
   * no label, button only
   */
  simple?: boolean;
}

type TProps = IProps & IBaseInputProps;

const ToggleButton: React.FunctionComponent<TProps> = (props) => {
  const { className, children, checked, disabled, simple, ...otherProps } = props;

  return (
    <div
      className={
        classNames(
          className,
          styles.toggleButton,
          {
            [styles.checked]: checked,
            [styles.disabled]: disabled,
            [styles.simple]: simple
          }
        )
      }
    >
      <BaseInput
        type="checkbox"
        checked={checked}
        disabled={disabled}
        label={<span>{children}</span>}
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
