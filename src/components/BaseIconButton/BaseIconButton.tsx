import classnames from 'classnames';
import React from 'react';
import { IconName } from '../../types/icon';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import styles from './BaseIconButton.scss';

export type TProps<A = React.HTMLAttributes<HTMLElement>> = A & {
  as?: React.ComponentType<A> | keyof React.ReactHTML;
  icon: IconName;
  disabled?: boolean;
};

const BaseIconButton = React.forwardRef<HTMLElement, TProps>((props, ref) => {
  const { className, as = Button, icon, children, ...otherProps } = props;
  const _props = {
    ...otherProps,
    ref,
    className: classnames(className, styles.baseIconButton)
  };
  const _children = (
    <React.Fragment>
      <Icon className={styles.icon} icon={icon} />
      {
        children && (
          <span>{children}</span>
        )
      }
    </React.Fragment>
  );
  return React.createElement(as, _props, _children);
});

export default BaseIconButton;
