// import debugFactory from 'debug';
import produce from 'immer';
import { dev } from '../../config/config';
import { displayName } from '../../package.json';
import type { TActions } from '../actions/lihkg';
import * as lihkgActions from '../actions/lihkg';
import * as ATTRIBUTES from '../constants/attributes';
import * as TEXTS from '../constants/texts';
import DataSet from '../models/DataSet';
import Label, { ISource } from '../models/Label';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.module.scss';
import { IBlockedUser, IIconMap, ILocalNotifcation, ILocalNotifcationPayload, IState, NotificationType, TNotification } from '../types/lihkg';
import { counter } from './counter';
import { waitForElement } from './dom';
import { findReduxStore } from './redux';

enum ShareType {
  Thread = 1,
  Reply = 2
}

type TCreateNotification = {
  /**
   * create a local notification object
   * @param {NotificationType.Local} type the notification type
   * @param {ILocalNotifcationPayload | string} body the notification payload, or just the body
   * @param {number} [duration=3000] the delay (ms) to dismiss the notification automatically
   */
  (type: NotificationType.Local, body: ILocalNotifcationPayload | string, duration?: number): ILocalNotifcation;
};

// const debug = debugFactory('libel:helper:lihkg');

/**
 * notification ID counter
 * @description it is hard to get the actual count,
 * `10000` should be high enough to not collide with LIHKG
 */
const notificationIdCount = counter(10000);

// export const getUserRegistrationDate = (user: IUser) => {
//   return new Date(user.create_time * 1000);
// };

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
  const app = document.querySelector(lihkgSelectors.app)!;
  const store = findReduxStore<IState, TActions>(app);
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

/**
 * create a notification object
 * @private
 * @see TCreateNotification
 */
const createNotification: TCreateNotification = (type, body, duration = 3000) => {
  const { value: id } = notificationIdCount.next();
  const defaultPayload: Partial<ILocalNotifcationPayload> = { title: displayName };
  const payload = typeof body === 'string' ? { ...defaultPayload, body } : { ...defaultPayload, ...body };
  const notification: ILocalNotifcation = { id, type, payload, duration };
  return notification;
};

/**
 * create a local notification object
 * @see {createNotification}
 */
export const createLocalNotification = (body: ILocalNotifcationPayload | string, duration?: number) => {
  return createNotification(NotificationType.Local, body, duration);
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

/**
 * convert blocked users to personal data set
 * @param {IBlockedUser[]} blockedUsers the blocked user list from LIHKG
 */
export const mapBlockedUsersToDataSet = (blockedUsers: IBlockedUser[]) => {
  const dataSet = DataSet.factory();
  const { data } = dataSet;
  for (const blockedUser of blockedUsers) {
    const { user_id, blocked_time, block_remark } = blockedUser;
    const { reason } = block_remark;
    const date = blocked_time * 1000;
    const label = new Label('-1', TEXTS.BLOCKED_USER_DEFAULT_LABEL_TEXT, reason, undefined, date);
    data[user_id] = [label];
  }
  return dataSet;
};

export const getReplyItemInnerElementByPostId = (postId: string) => {
  const selector = `[${ATTRIBUTES.DATA_POST_ID}="${postId}"]`;
  const element = document.querySelector<HTMLDivElement>(selector);
  return element;
};

/* debug */
if (dev) {
  (window as any).__LIBEL_DEBUG_LIHKG_GET_STORE__ = getStore;
  (window as any).__LIBEL_DEBUG_LIHKG_SHOW_NOTIFICATION__ = showNotification;
  (window as any).__LIBEL_DEBUG_LIHKG_REMOVE_NOTIFICATION__ = removeNotification;
}
