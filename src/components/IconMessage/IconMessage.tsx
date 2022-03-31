import classNames from 'classnames';
import React from 'react';
import Icon from '../Icon/Icon';
import type { IconName } from '../Icon/types';
import styles from './IconMessage.module.scss';

interface IProps {
  icon: IconName;
}

export type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const IconMessage: React.FunctionComponent<TProps> = (props) => {
  const { className, icon, children, ...otherProps } = props;
  return (
    <div {...otherProps} className={classNames(className, styles.error)}>
      <Icon className={styles.icon} icon={icon} />
      {children}
    </div>
  );
};

IconMessage.displayName = 'IconMessage';

export default IconMessage;
