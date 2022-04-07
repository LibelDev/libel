import classNames from 'classnames';
import React, { useContext } from 'react';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import styles from './Header.module.scss';
import IDsContext from './IDsContext';

interface IProps {
  onClose: () => void;
}

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const Header: React.FunctionComponent<TProps> = (props) => {
  const { className, onClose, children, ...otherProps } = props;
  const { title: id } = useContext(IDsContext);
  return (
    <div
      {...otherProps}
      className={
        classNames(
          className,
          styles.header
        )
      }
    >
      <h2 id={id} className={styles.title}>
        {children}
      </h2>
      <IconButton
        className={styles.close}
        icon={IconName.Close}
        onClick={onClose}
      />
    </div>
  );
};

Header.displayName = 'Header';

export default Header;
