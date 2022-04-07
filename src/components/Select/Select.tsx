import classNames from 'classnames';
import React, { useId } from 'react';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import styles from './Select.module.scss';

interface IProps {
  border?: boolean;
  label?: React.ReactNode;
  error?: React.ReactNode;
}

type TComponentProps = React.ComponentPropsWithoutRef<'select'>;

type TProps = IProps & TComponentProps;

const Select: React.FunctionComponent<TProps> = (props) => {
  const { id, className, border, label, error, ...otherProps } = props;

  const _id = id || useId();
  const _errorId = `${_id}-error`;

  return (
    <div className={classNames(className, styles.wrapper)}>
      {
        label && (
          <span className={styles.label}>
            <label htmlFor={_id}>
              {label}
            </label>
          </span>
        )
      }
      <div>
        <div
          className={
            classNames(
              styles.select,
              {
                [styles.border]: border
              }
            )
          }
        >
          <select id={_id} {...otherProps} />
          <Icon className={styles.icon} icon={IconName.ChevronDown} />
        </div>
        {
          !!error && (
            <ErrorMessage id={_errorId} className={styles.error}>
              {error}
            </ErrorMessage>
          )
        }
      </div>
    </div>
  );
};

Select.displayName = 'Select';

export default Select;
