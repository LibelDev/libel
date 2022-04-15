import classNames from 'classnames';
import React from 'react';
import BaseInput, { TProps as TBaseInputProps } from '../BaseInput/BaseInput';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import styles from './TextInput.module.scss';

interface IProps {
  icon?: IconName;
  error?: React.ReactNode;
  invalid?: boolean;
  onClear?: React.MouseEventHandler<HTMLButtonElement>;
}

export type TProps = IProps & TBaseInputProps;

const TextInput = React.forwardRef<HTMLInputElement, TProps>((props, ref) => {
  const { className, icon, error, invalid, onClear, ...otherProps } = props;
  return (
    <div className={classNames(className, styles.textInput)}>
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
