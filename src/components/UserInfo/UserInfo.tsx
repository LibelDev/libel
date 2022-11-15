import classNames from 'classnames';
import React from 'react';
import * as TEXTS from '../../constants/texts';
import { getElementLabelTipProps } from '../../helpers/common';
import type { IUser } from '../../types/lihkg';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import Username from '../Username/Username';
import styles from './UserInfo.module.scss';

/**
 * original props
 */
interface IProps {
  user: IUser;
}

/**
 * component props
 */
type TComponentProps = TComponentPropsWithoutRef<'small', IProps>;

/**
 * `UserInfo` props
 */
type TProps = IProps & TComponentProps;

const UserInfo: React.FunctionComponent<TProps> = (props) => {
  const { className, user, ...otherProps } = props;
  return (
    <small className={classNames(className, styles.userInfo)} {...otherProps}>
      <span>
        <Icon className={styles.icon} icon={IconName.Account} />
        <span {...getElementLabelTipProps(TEXTS.USER_ID_TOOLTIP_TEXT)}>
          #{user.user_id}
        </span>
      </span>
      <Username
        user={user}
        {...getElementLabelTipProps(TEXTS.CURRENT_USERNAME_TOOLTIP_TEXT)}
      />
    </small>
  );
};

UserInfo.displayName = 'UserInfo';

export const createContainer = () => {
  const container = document.createElement('div');
  container.classList.add(styles.container);
  return container;
};

export default UserInfo;
