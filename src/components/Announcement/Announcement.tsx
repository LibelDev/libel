import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useMeasure, useWindowSize } from 'react-use';
import logo from '../../../assets/logos/libel.png';
import { displayName } from '../../../package.json';
import * as TEXTS from '../../constants/texts';
import useRemoveParentElement from '../../hooks/useRemoveParentElement';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.scss';
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
  const { pathname } = useLocation();
  const [measureAnnouncementRef, { height: announcementHeight }] = useMeasure<HTMLDivElement>();
  const { width: windowWidth } = useWindowSize();

  const updateLayout = () => {
    const announcementContainer = announcementRef.current?.parentElement;
    if (announcementContainer) {
      const { offsetHeight } = announcementContainer;
      const leftPanel = document.querySelector<HTMLDivElement>(lihkgSelectors.leftPanel);
      const rightPanel = document.querySelector<HTMLDivElement>(lihkgSelectors.rightPanel);
      const isMobileView = windowWidth >= 768;
      if (leftPanel) {
        leftPanel.style.marginTop = isMobileView ? '' : `${offsetHeight}px`;
      }
      if (rightPanel) {
        rightPanel.style.height = isMobileView ? `calc(100vh - 3rem - ${offsetHeight}px)` : '';
        rightPanel.style.marginTop = `${offsetHeight}px`;
      }
    }
  };

  useRemoveParentElement(announcementRef, !showed);

  useEffect(() => {
    measureAnnouncementRef(announcementRef.current!);
  }, [announcementRef.current]);

  useEffect(updateLayout, [pathname, announcementHeight, windowWidth]);

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
