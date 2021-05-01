import classnames from 'classnames';
import React from 'react';
import styles from './LoadingSpinner.scss';

interface IProps extends React.HTMLAttributes<HTMLLIElement> { }

const LoadingSpinner: React.FunctionComponent<IProps> = (props) => {
  const { className } = props;
  return (
    <i
      className={classnames(className, styles.loadingSpinner)}
      aria-hidden={true}
    />
  );
};

export default LoadingSpinner;
