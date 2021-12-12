import classNames from 'classnames';
import React from 'react';
import useElementID from '../../hooks/useElementID';
import BaseInput, { IProps as IBaseInputProps } from '../BaseInput/BaseInput';
import styles from './TextInput.scss';

interface IProps extends IBaseInputProps {
  error?: React.ReactNode;
}

const TextInput: React.FunctionComponent<IProps> = (props) => {
  const { id, className, error, ...otherProps } = props;

  const _id = id || useElementID(TextInput.displayName!);
  const errorID = `${_id}-error`;

  return (
    <React.Fragment>
      <div
        className={
          classNames(
            className,
            styles.textInput,
            {
              [styles.error]: !!error
            }
          )
        }
      >
        <BaseInput
          error={error}
          aria-describedby={errorID}
          {...otherProps}
        />
      </div>
    </React.Fragment>
  );
};

TextInput.displayName = 'TextInput';

export default TextInput;
