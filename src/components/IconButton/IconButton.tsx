import classnames from 'classnames';
import React from 'react';
import Icon, { IconName } from '../Icon/Icon';
import styles from './IconButton.scss';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
}

const IconButton = React.forwardRef<HTMLButtonElement, IProps>((props, ref) => {
  const { className, icon, children, ...otherProps } = props;
  return (
    <button
      ref={ref}
      className={classnames(className, styles.iconButton)}
      {...otherProps}
    >
      <Icon className={styles.icon} icon={icon} />
      {
        children && (
          <span>{children}</span>
        )
      }
    </button>
  );
});

export default IconButton;

export { IconName };

