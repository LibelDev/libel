import classNames from 'classnames';
import React from 'react';
import useElementID from '../../hooks/useElementID';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './BaseInput.module.scss';

interface IProps {
  label?: React.ReactNode;
  error?: React.ReactNode;
}

export type TProps = IProps & React.ComponentPropsWithoutRef<'input'>;

const BaseInput: React.FunctionComponent<TProps> = (props) => {
  const { id, className, disabled, label, error, ...otherProps } = props;

  const _id = id || useElementID(BaseInput.displayName!);
  const errorID = `${_id}-error`;

  return (
    <React.Fragment>
      {
        label && (
          <span className={styles.label}>
            <label htmlFor={_id}>
              {label}
            </label>
          </span>
        )
      }
      <div className={classNames(className, styles.input)}>
        <input
          id={_id}
          disabled={disabled}
          aria-describedby={errorID}
          {...otherProps}
        />
        {
          !!error && (
            <ErrorMessage id={errorID} className={styles.error}>
              {error}
            </ErrorMessage>
          )
        }
      </div>
    </React.Fragment>
  );
};

BaseInput.displayName = 'Input';

export default BaseInput;
