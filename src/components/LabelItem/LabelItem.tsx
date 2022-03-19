import classNames from 'classnames';
import invert from 'invert-color';
import React, { useMemo } from 'react';
import styles from './LabelItem.module.scss';

interface IProps {
  color?: string;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'div'>;

const LabelItem = React.forwardRef<HTMLDivElement, TProps>((props, ref) => {
  const { className, children, color, ...otherProps } = props;

  const style: Partial<React.CSSProperties> | undefined = useMemo(() => (color ? {
    backgroundColor: color,
    borderColor: color,
    color: color && invert(color, true)
  } : undefined), [color]);

  return (
    <div
      ref={ref}
      className={
        classNames(
          className,
          styles.labelItem
        )
      }
      style={style}
      {...otherProps}
    >
      {children}
    </div>
  );
});

export default LabelItem;
