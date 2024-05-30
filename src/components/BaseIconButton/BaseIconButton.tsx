import classNames from 'classnames';
import type React from 'react';
import Button, { type TProps as TButtonProps } from '../Button/Button';
import Icon from '../Icon/Icon';
import type { IconName } from '../Icon/types';
import styles from './BaseIconButton.module.scss';

interface IProps {
  icon: IconName | JSX.Element;
}

type TComponentProps<T extends React.ElementType> = TComponentPropsWithoutRef<T, IProps>;

export type TProps<T extends React.ElementType> = IProps & TComponentProps<T> & TButtonProps<T>;

/**
 * @extends Button
 */
function BaseIconButton<T extends React.ElementType> (props: TProps<T>) {
  const { className, children, icon, ...otherProps } = props;
  return (
    <Button
      {...otherProps}
      className={classNames(className, styles.baseIconButton)}
    >
      {
        typeof icon === 'string' ? (
          <Icon className={styles.icon} icon={icon} />
        ) : (
          <span className={styles.icon}>{icon}</span>
        )
      }
      {
        children && (
          <span>{children}</span>
        )
      }
    </Button>
  );
}

BaseIconButton.displayName = 'BaseIconButton';

export default BaseIconButton;
