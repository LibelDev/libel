import classnames from 'classnames';
import React, { useRef, useState } from 'react';
import logo from '../../../assets/logos/libel.png';
import { displayName } from '../../../package.json';
import * as TEXTS from '../../constants/texts';
import useRemoveParentElement from '../../hooks/useRemoveParentElement';
import { IconName } from '../../types/icon';
import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import styles from './Announcement.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconName;
}

const Announcement: React.FunctionComponent<IProps> = (props) => {
  const { className, icon, children } = props;
  const [showed, setShowed] = useState(true);

  const handleClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setShowed(false);
  };

  const announcementRef = useRef<HTMLDivElement>(null);
  useRemoveParentElement(announcementRef, !showed);

  return (
    <div
      ref={announcementRef}
      className={classnames(className, styles.announcement)}
    >
      <img className={styles.logo} src={logo} alt={displayName} />
      {icon && <Icon icon={icon} />}
      <span className={styles.message} aria-live="polite" role="status">
        {children}
      </span>
      <IconButton
        icon={IconName.Close}
        onClick={handleClose}
        aria-label={TEXTS.ANNOUNCEMENT_CLOSE_BUTTON_TEXT}
      />
    </div>
  );
};

export default Announcement;
