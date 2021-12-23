import classnames from 'classnames';
import React from 'react';
import { MappedHTMLAttributes } from '../../helpers/types';
import styles from './LoadingSpinner.scss';

interface IProps { }

type TProps = IProps & MappedHTMLAttributes<'i'>;

const LoadingSpinner: React.FunctionComponent<TProps> = (props) => {
  const { className } = props;
  return (
    <i
      className={classnames(className, styles.loadingSpinner)}
      aria-hidden={true}
    />
  );
};

export default LoadingSpinner;
