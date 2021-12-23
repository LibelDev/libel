import classnames from 'classnames';
import React from 'react';
import { IconName } from '../../types/icon';
import BaseButton, { TProps as TBaseButtonProps } from '../BaseButton/BaseButton';
import Icon from '../Icon/Icon';
import styles from './BaseIconButton.scss';

interface IProps {
  icon: IconName;
}

export type TProps = IProps & TBaseButtonProps;

const BaseIconButton: React.FunctionComponent<TProps> = (props) => {
  const { className, children, icon, ...otherProps } = props;
  return (
    <BaseButton
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
    </BaseButton>
  );
};

export default BaseIconButton;
