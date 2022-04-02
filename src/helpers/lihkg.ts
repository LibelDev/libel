// import debugFactory from 'debug';
import produce from 'immer';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.module.scss';
import type { IIconMap, IUser, TTracablePost } from '../types/lihkg';
import { waitForElement } from './dom';
import { findReduxStore, IReactRootElement } from './redux';

enum ShareType {
  Thread = 1,
  Reply = 2
}

// const debug = debugFactory('libel:helper:lihkg');

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
 * @param {TTracablePost} post the label source 
 * @returns the share ID
 */
export const getShareID = (post: TTracablePost) => {
  const e = post.thread_id; // thread ID
  if (post.msg_num === '1') {
    return e;
  }
  const t = ShareType.Reply; // the share type: thread or reply
  const n = parseInt(post.msg_num, 10); // the share variable: message number
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
