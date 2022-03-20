import classNames from 'classnames';
import React from 'react';
import useElementID from '../../hooks/useElementID';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import styles from './Select.module.scss';

interface IProps {
  border?: boolean;
  label?: React.ReactNode;
  error?: React.ReactNode;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'select'>;

const Select: React.FunctionComponent<TProps> = (props) => {
  const { id, className, border, label, error, ...otherProps } = props;

  const _id = id || useElementID(Select.displayName!);
  const errorID = `${_id}-error`;

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
          error && (
            <div className={styles.error}>
              <div id={errorID}>
                <Icon className={styles.icon} icon={IconName.CommentAlert} />
                {error}
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

Select.displayName = 'Select';

export default Select;
