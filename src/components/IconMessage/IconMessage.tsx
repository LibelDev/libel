import classNames from 'classnames';
import React from 'react';
import Icon from '../Icon/Icon';
import type { IconName } from '../Icon/types';
import styles from './IconMessage.module.scss';

interface IProps {
  as?: React.ElementType;
  icon: IconName;
}

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

export type TProps = IProps & TComponentProps;

const IconMessage: React.FunctionComponent<TProps> = (props) => {
  const { className, as: Component = 'div', icon, children, ...otherProps } = props;
  return (
    <Component {...otherProps} className={classNames(className, styles.iconMessage)}>
      <Icon className={styles.icon} icon={icon} />
      {children}
    </Component>
  );
};

IconMessage.displayName = 'IconMessage';

export default IconMessage;
