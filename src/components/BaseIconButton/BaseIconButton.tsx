import classnames from 'classnames';
import React from 'react';
import Button, { TProps as TButtonProps } from '../Button/Button';
import Icon from '../Icon/Icon';
import type { IconName } from '../Icon/types';
import styles from './BaseIconButton.module.scss';

interface IProps {
  icon: IconName | JSX.Element;
}

export type TProps = IProps & TButtonProps;

const BaseIconButton: React.FunctionComponent<TProps> = (props) => {
  const { className, children, icon, ...otherProps } = props;
  return (
    <Button
      {...otherProps}
      className={classnames(className, styles.baseIconButton)}
    >
      <React.Fragment>
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
      </React.Fragment>
    </Button>
  );
};

export default BaseIconButton;
