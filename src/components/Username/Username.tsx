import classNames from 'classnames';
import React from 'react';
import lihkgCssClasses from '../../stylesheets/variables/lihkg/classes.module.scss';
import { Gender, IUser } from '../../types/lihkg';

/**
 * original props
 */
interface IProps {
  user: IUser;
}

/**
 * component props
 */
type TComponentProps = TComponentPropsWithoutRef<'span', IProps>;

/**
 * `Username` props
 */
type TProps = IProps & TComponentProps;

const Username: React.FunctionComponent<TProps> = (props) => {
  const { className, user, ...otherProps } = props;
  return (
    <span
      className={
        classNames({
          [lihkgCssClasses.usernameFemale]: user.gender === Gender.Female,
          [lihkgCssClasses.usernameMale]: user.gender === Gender.Male
        })
      }
      {...otherProps}
    >
      {user.nickname}
    </span>
  );
};

Username.displayName = 'Username';

export default Username;
