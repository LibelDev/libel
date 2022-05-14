import classNames from 'classnames';
import type React from 'react';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import styles from './Header.module.scss';
import useModal from './hooks/useModal';

interface IProps { }

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const Header: React.FunctionComponent<TProps> = (props) => {
  const { className, children, ...otherProps } = props;
  const { ids, onClose } = useModal();
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
      <h2 id={ids.title} className={styles.title}>
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
