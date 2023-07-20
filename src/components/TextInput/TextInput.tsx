import classNames from 'classnames';
import type React from 'react';
import { forwardRef, useId } from 'react';
import BaseInput, { type TProps as TBaseInputProps } from '../BaseInput/BaseInput';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import styles from './TextInput.module.scss';

interface IProps {
  label?: React.ReactNode;
  icon?: IconName;
  error?: React.ReactNode;
  invalid?: boolean;
  onClear?: React.MouseEventHandler<HTMLButtonElement>;
}

export type TProps = IProps & TBaseInputProps;

const TextInput = forwardRef<HTMLInputElement, TProps>((props, ref) => {
  const { id, className, label, icon, error, invalid, onClear, ...otherProps } = props;

  const _id = id || useId();

  return (
    <div className={classNames(className, styles.textInput)}>
      {
        label && (
          <label htmlFor={_id}>
            {label}
          </label>
        )
      }
      {
        icon && (
          <Icon className={styles.icon} icon={icon} />
        )
      }
      {
        onClear && (
          <IconButton className={styles.clear} icon={IconName.Close} onClick={onClear} />
        )
      }
      <BaseInput
        {...otherProps}
        id={_id}
        ref={ref}
        type="text"
        className={
          classNames(
            styles.input,
            {
              [styles.invalid]: invalid || !!error
            }
          )
        }
        error={error}
      />
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
