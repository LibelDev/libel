// import debugFactory from 'debug';
import produce from 'immer';
import { dev } from '../../config/config';
import { displayName } from '../../package.json';
import * as lihkgActions from '../actions/lihkg';
import { ISource } from '../models/Label';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.module.scss';
import type { IIconMap, ILocalNotifcation, ILocalNotifcationPayload, IUser, NotificationType, TNotification } from '../types/lihkg';
import { counter } from './counter';
import { waitForElement } from './dom';
import { findReduxStore, IReactRootElement } from './redux';

enum ShareType {
  Thread = 1,
  Reply = 2
}

/**
 * create a notification object
 */
type TCreateNotification = (
  /**
   * create a local notification
   * @param {NotificationType.Local} type the notification type
   * @param {ILocalNotifcationPayload | string} body the notification payload, or just the body
   * @param {number} [duration=3000] the delay (ms) to dismiss the notification automatically
   */
  (type: NotificationType.Local, body: ILocalNotifcationPayload | string, duration?: number) => ILocalNotifcation
);

// const debug = debugFactory('libel:helper:lihkg');

/**
 * notification ID counter
 * @description start from `10000`, because it is hard to get the actual count,
 * `10000` should be high enough to not collide with LIHKG
 */
const notificationIdCount = counter(10000);

export const getUserRegistrationDate = (user: IUser) => {
  return new Date(user.create_time * 1000);
};

export const waitForSubmissionForm = () => {
  return waitForElement(lihkgSelectors.submissionForm);
};

export const waitForRightPanelContainer = async () => {
  const splitView = await waitForElement(lihkgSelectors.splitView);
  return splitView.querySelector(lihkgSelectors.rightPanelContainer)!;
};

/**
 * get the original LIHKG redux store
 */
export const getStore = () => {
  const app = document.querySelector(lihkgSelectors.app);
  const store = findReduxStore(app as IReactRootElement);
  return store;
};

/**
 * unlock all icons
 * @param {IIconMap} iconMap the original LIHKG icon map
 * @returns the unlocked icon map
 */
export const unlockIconMap = (iconMap: IIconMap) => {
  return produce(iconMap, (iconMap) => {
    const keys = Object.keys(iconMap);
    for (const key of keys) {
      const iconSet = iconMap[key];
      iconSet.icons = { ...iconSet.icons, ...iconSet.special }; // unlock all special icons
      delete iconSet.showOn; // unlock all icon sets by removing the show conditions
    }
  });
};

/**
 * get the share ID of the reply
 * @copyright the implementation is a reference from LIHKG production build
 * @param {ISource} source the label source
 * @returns the share ID
 */
export const getShareID = (source: ISource) => {
  const e = source.thread; // thread ID
  if (source.messageNumber === '1') {
    return e;
  }
  const t = ShareType.Reply; // the share type: thread or reply
  const n = parseInt(source.messageNumber, 10); // the share variable: message number
  const x = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQR'; // the hash seed
  const C = (e: number, t: string) => {
    let n;
    let r = '';
    while (e > 0) {
      r = t[n = (e - 1) % t.length] + r;
      e = parseInt(((e - n) / t.length).toString(), 10);
    }
    return r;
  };
  if (t > 0) {
    const r = n.toString().length - 1;
    const i = r << 1 | t - 1;
    return C(parseInt(`${e}${n}`, 10), x) + 'STUVWXYZ'[i];
  }
  // since `t > 0` will always be `true`
  // this will neven happen, but just keep this for consistency
  return C(parseInt(e, 10), 'abcdefghijkmnopqrstuvwxyz');
};

export const createNotification: TCreateNotification = (type, body, duration = 3000) => {
  const { value: id } = notificationIdCount.next();
  const defaultPayload: Partial<ILocalNotifcationPayload> = { title: displayName };
  const payload = typeof body === 'string' ? { ...defaultPayload, body } : { ...defaultPayload, ...body };
  const notification: ILocalNotifcation = { id, type, payload, duration };
  return notification;
};

/**
 * show the notification
 * @param {TNotification} notification the notification object
 */
export const showNotification = (notification: TNotification) => {
  const store = getStore();
  const { dispatch } = store!;
  dispatch(lihkgActions.showNotification(notification));
  const { id, duration } = notification;
  if (duration > 0) {
    setTimeout(() => {
      dispatch(lihkgActions.removeNotification(id));
    }, duration);
  }
  return notification;
};

/**
 * dismiss the notification
 * @param {number} id the notification ID
 */
export const removeNotification = (id: number) => {
  const store = getStore();
  const { dispatch } = store!;
  dispatch(lihkgActions.removeNotification(id));
};

/* debug */
if (dev) {
  (window as any).__LIBEL_DEBUG_LIHKG_GET_STORE__ = getStore;
  (window as any).__LIBEL_DEBUG_LIHKG_SHOW_NOTIFICATION__ = showNotification;
  (window as any).__LIBEL_DEBUG_LIHKG_REMOVE_NOTIFICATION__ = removeNotification;
}
