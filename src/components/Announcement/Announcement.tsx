import classNames from 'classnames';
import max from 'lodash/max';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-use';
import logo from '../../../assets/logos/libel.png';
import { displayName } from '../../../package.json';
import { EventAction, EventCategory } from '../../constants/ga';
import * as TEXTS from '../../constants/texts';
import { dontShowAgain, promptDontShowAgain } from '../../helpers/announecement';
import * as gtag from '../../helpers/gtag';
import { isViewport, Viewport } from '../../helpers/responsive';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import styles from './Announcement.module.scss';

interface IProps {
  icon?: IconName;
  forced?: boolean;
}

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

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

  const handleClose: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    setShowed(false);
    if (id && !forced && promptDontShowAgain()) {
      dontShowAgain(id, 7);
    }
    // analytics
    gtag.event(EventAction.Close, { event_category: EventCategory.Announcement, event_label: id });
  }, [id, forced]);

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
    // analytics
    gtag.event(EventAction.Open, { event_category: EventCategory.Announcement, event_label: id });
    return () => {
      const index = announcementElements.indexOf(current!);
      announcementElements.splice(index, 1);
      if (announcementElements.length === 0) {
        window.removeEventListener('resize', updateLayout);
      }
    };
  }, [id]);

  useEffect(updateLayout, [pathname]);

  if (!showed) {
    return null;
  }

  return (
    <div
      ref={announcementRef}
      className={classNames(className, styles.announcement)}
    >
      <img className={styles.logo} src={logo} alt={displayName} />
      {icon && <Icon icon={icon} />}
      <span className={styles.message} aria-live="polite" role="status">
        {children}
      </span>
      <IconButton
        icon={IconName.Close}
        onClick={handleClose}
        aria-label={TEXTS.BUTTON_TEXT_CLOSE_ANNOUNCEMENT}
      />
    </div>
  );
};

Announcement.displayName = 'Announcement';

export default Announcement;
