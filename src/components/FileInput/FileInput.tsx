import classNames from 'classnames';
import type React from 'react';
import { useId } from 'react';
import BaseInput from '../BaseInput/BaseInput';
import styles from './FileInput.module.scss';

interface IProps { }

type TComponentProps = React.ComponentPropsWithoutRef<'input'>;

type TProps = IProps & TComponentProps;

const FileInput: React.FunctionComponent<TProps> = (props) => {
  const { id, className, children, ...otherProps } = props;

  const _id = id || useId();

  return (
    <div className={classNames(className, styles.fileInput)}>
      {
        children && (
          <label htmlFor={_id}>
            {children}
          </label>
        )
      }
      <BaseInput
        {...otherProps}
        id={_id}
        className={styles.input}
        type="file"
      />
    </div>
  );
};

FileInput.displayName = 'FileInput';

export default FileInput;
