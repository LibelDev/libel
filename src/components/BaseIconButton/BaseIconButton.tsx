import classnames from 'classnames';
import React from 'react';
import Button, { TProps as TButtonProps } from '../Button/Button';
import Icon from '../Icon/Icon';
import type { IconName } from '../Icon/types';
import styles from './BaseIconButton.module.scss';

interface IProps {
  icon: IconName;
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
        <Icon className={styles.icon} icon={icon} />
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
