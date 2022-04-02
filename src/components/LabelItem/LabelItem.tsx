import classNames from 'classnames';
import React from 'react';
import styles from './LabelItem.module.scss';

interface IProps { }

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const LabelItem = React.forwardRef<HTMLDivElement, TProps>((props, ref) => {
  const { className, children, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={
        classNames(
          className,
          styles.labelItem
        )
      }
      {...otherProps}
    >
      <div className={styles.inner}>
        {children}
      </div>
    </div>
  );
});

export default LabelItem;
