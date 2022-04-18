import classNames from 'classnames';
import React, { useId } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './BaseInput.module.scss';

interface IProps {
  error?: React.ReactNode;
}

type TComponentProps = React.ComponentPropsWithoutRef<'input'>;

export type TProps = IProps & TComponentProps;

const BaseInput = React.forwardRef<HTMLInputElement, TProps>((props, ref) => {
  const { id, className, error, ...otherProps } = props;

  const _id = id || useId();
  const _errorId = `${_id}-error`;

  return (
    <div className={classNames(className, styles.baseInput)}>
      <input
        {...otherProps}
        ref={ref}
        id={_id}
        aria-describedby={_errorId}
      />
      {
        !!error && (
          <ErrorMessage id={_errorId} className={styles.error}>
            {error}
          </ErrorMessage>
        )
      }
    </div>
  );
});

BaseInput.displayName = 'BaseInput';

export default BaseInput;
