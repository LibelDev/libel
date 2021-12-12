import React from 'react';
import useElementID from '../../hooks/useElementID';
import { IconName } from '../../types/icon';
import Icon from '../Icon/Icon';
import styles from './BaseInput.scss';

export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: React.ReactNode;
}

const BaseInput: React.FunctionComponent<IProps> = (props) => {
  const { id, className, disabled, label, error, ...otherProps } = props;

  const _id = id || useElementID(BaseInput.displayName!);
  const errorID = `${_id}-error`;

  return (
    <React.Fragment>
      {
        label && (
          <span>
            <label htmlFor={_id}>
              {label}
            </label>
          </span>
        )
      }
      <div>
        <input
          id={_id}
          className={styles.input}
          disabled={disabled}
          aria-describedby={errorID}
          {...otherProps}
        />
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
    </React.Fragment>
  );
};

BaseInput.displayName = 'Input';

export default BaseInput;
