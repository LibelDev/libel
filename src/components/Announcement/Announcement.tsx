import classnames from 'classnames';
import max from 'lodash/max';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-use';
import logo from '../../../assets/logos/libel.png';
import { displayName } from '../../../package.json';
import * as TEXTS from '../../constants/texts';
import { dontShowAgain, promptDontShowAgain } from '../../helpers/announecement';
import { isViewport, Viewport } from '../../helpers/responsive';
import { MappedHTMLAttributes } from '../../helpers/types';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.scss';
import { IconName } from '../../types/icon';
import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import styles from './Announcement.scss';

interface IProps {
  icon?: IconName;
  forced?: boolean;
}

type TProps = IProps & MappedHTMLAttributes<'div'>;

const announcementElements: HTMLDivElement[] = [];

const getTallestAnnouncementHeight = () => {
  const heights = announcementElements.map((element) => element.offsetHeight);
  const height = max(heights);
  return height || 0;
};

const updateLayout = () => {
  const height = getTallestAnnouncementHeight();
  const leftPanel = document.querySelector<HTMLDivElement>(lihkgSelectors.leftPanel);
  const rightPanel = document.querySelector<HTMLDivElement>(lihkgSelectors.rightPanel);
  if (leftPanel) {
    leftPanel.style.marginTop = (isViewport(Viewport.Medium) || !height) ? '' : `${height}px`;
  }
  if (rightPanel) {
    rightPanel.style.height = isViewport(Viewport.Medium) && height ? `calc(100vh - 3rem - ${height}px)` : '';
    rightPanel.style.marginTop = height ? `${height}px` : '';
  }
};

const Announcement: React.FunctionComponent<TProps> = (props) => {
  const { id, className, icon, forced = false, children } = props;
  const [showed, setShowed] = useState(true);

  const handleClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setShowed(false);
    if (id && !forced && promptDontShowAgain()) {
      dontShowAgain(id, 7);
    }
  };

  const announcementRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const { current } = announcementRef;
    if (current) {
      announcementElements.push(current);
      if (announcementElements.length === 1) {
        window.addEventListener('resize', updateLayout);
      }
    } else {
      updateLayout();
    }
    return () => {
      const index = announcementElements.indexOf(current!);
      announcementElements.splice(index, 1);
      if (announcementElements.length === 0) {
        window.removeEventListener('resize', updateLayout);
      }
    };
  }, [showed]);

  useEffect(updateLayout, [pathname]);

  if (!showed) {
    return null;
  }

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
