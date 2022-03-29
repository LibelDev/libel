import classNames from 'classnames';
import React from 'react';
import BaseInput, { TProps as TBaseInputProps } from '../BaseInput/BaseInput';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import styles from './TextInput.module.scss';

interface IProps {
  icon?: IconName;
  error?: React.ReactNode;
}

export type TProps = IProps & TBaseInputProps;

const TextInput: React.FunctionComponent<TProps> = (props) => {
  const { className, icon, error, ...otherProps } = props;
  return (
    <div className={classNames(className, styles.textInput)}>
      {
        icon && (
          <Icon className={styles.icon} icon={icon} />
        )
      }
      <BaseInput
        {...otherProps}
        type="text"
        className={
          classNames(
            styles.input,
            {
              [styles.hasIcon]: !!icon,
              [styles.error]: !!error
            }
          )
        }
        error={error}
      />
    </div>
  );
};

TextInput.displayName = 'TextInput';

export default TextInput;
