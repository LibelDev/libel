import classNames from 'classnames';
import React from 'react';
import BaseInput, { TProps as TBaseInputProps } from '../BaseInput/BaseInput';
import styles from './TextInput.module.scss';

interface IProps {
  error?: React.ReactNode;
}

type TProps = IProps & TBaseInputProps;

const TextInput: React.FunctionComponent<TProps> = (props) => {
  const { className, error, ...otherProps } = props;
  return (
    <div className={classNames(className, styles.textInput)}>
      <BaseInput
        {...otherProps}
        type="text"
        className={
          classNames(
            styles.input,
            {
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
