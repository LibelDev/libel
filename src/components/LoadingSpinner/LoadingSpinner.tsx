import classnames from 'classnames';
import React from 'react';
import styles from './LoadingSpinner.module.scss';

interface IProps { }

type TComponentProps = React.ComponentPropsWithoutRef<'i'>;

type TProps = IProps & TComponentProps;

const LoadingSpinner: React.FunctionComponent<TProps> = (props) => {
  const { className, ...otherProps } = props;
  return (
    <i
      className={classnames(className, styles.loadingSpinner)}
      aria-hidden
      {...otherProps}
    />
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
