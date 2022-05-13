import classNames from 'classnames';
import type React from 'react';
import Icon from '../Icon/Icon';
import type { IconName } from '../Icon/types';
import styles from './IconMessage.module.scss';

export interface IProps {
  icon: IconName;
}

type TComponentProps<T extends React.ElementType> = TComponentPropsWithoutRefWithAs<T, IProps>;

export type TProps<T extends React.ElementType = 'div'> = IProps & TComponentProps<T>;

function IconMessage<T extends React.ElementType> (props: TProps<T>) {
  const {
    className,
    as,
    icon,
    children,
    ...otherProps
  } = props;

  const Component = as || 'div';

  return (
    <Component {...otherProps} className={classNames(className, styles.iconMessage)}>
      <Icon className={styles.icon} icon={icon} />
      {children}
    </Component>
  );
}

IconMessage.displayName = 'IconMessage';

export default IconMessage;
