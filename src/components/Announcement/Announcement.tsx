import classnames from 'classnames';
import React, { useRef, useState } from 'react';
import * as TEXTS from '../../constants/texts';
import useRemoveParentElement from '../../hooks/useRemoveParentElement';
import Icon, { IconName } from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import styles from './Announcement.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> { }

const Announcement: React.FunctionComponent<IProps> = (props) => {
  const { className, ...otherProps } = props;
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
      aria-live="polite"
      role="status"
    >
      <Icon icon={IconName.Bell} />
      <span className={styles.message} {...otherProps} />
      <IconButton
        icon={IconName.Close}
        onClick={handleClose}
        aria-label={TEXTS.ANNOUNCEMENT_CLOSE_BUTTON_TEXT}
      />
    </div>
  );
};

export default Announcement;
