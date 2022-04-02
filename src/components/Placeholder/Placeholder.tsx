import classNames from 'classnames';
import React from 'react';
import styles from './Placeholder.module.scss';

interface IProps { }

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const Placeholder: React.FunctionComponent<TProps> = (props) => {
  const { className, ...otherProps } = props;
  return (
    <div
      {...otherProps}
      className={
        classNames(
          className,
          styles.placeholder
        )
      }
      aria-hidden
    />
  );
};

Placeholder.displayName = 'Placeholder';

export default Placeholder;
