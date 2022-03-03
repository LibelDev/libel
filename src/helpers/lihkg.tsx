import { Store } from '@reduxjs/toolkit';
import produce from 'immer';
import React from 'react';
import ReactDOM, { Renderer } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { namespace } from '../../package.json';
import cache from '../cache';
import AddLabelButton from '../components/AddLabelButton/AddLabelButton';
import addLabelButtonStyles from '../components/AddLabelButton/AddLabelButton.module.scss';
import announcementStyles from '../components/Announcement/Announcement.module.scss';
import LabelBook from '../components/LabelBook/LabelBook';
import LabelList from '../components/LabelList/LabelList';
import labelListStyles from '../components/LabelList/LabelList.module.scss';
import SettingSection from '../components/SettingSection/SettingSection';
import settingSectionStyles from '../components/SettingSection/SettingSection.module.scss';
import UnlockIconMapToggleButton from '../components/UnlockIconMapToggleButton/UnlockIconMapToggleButton';
import unlockIconMapToggleButtonStyles from '../components/UnlockIconMapToggleButton/UnlockIconMapToggleButton.module.scss';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import * as TEXTS from '../constants/texts';
import { ISource } from '../models/Label';
import { persistor } from '../store/store';
import lihkgCssClasses from '../stylesheets/variables/lihkg/classes.module.scss';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.module.scss';
import { IIconMap, IUser, TTracablePost } from '../types/lihkg';
import { insertAfter, waitForElement } from './dom';
import { findReduxStore, IReactRootElement } from './redux';

type TRendererContainer = Parameters<Renderer>[1];

enum ShareType {
  Thread = 1,
  Reply = 2
}

export const getUserRegistrationDate = (user: IUser) => {
  return new Date(user.create_time * 1000);
};

const isThread = (node: Element) => {
  return node.matches(`.${lihkgCssClasses.thread}`);
};

const isUserCardModal = (node: Element) => {
  return isModalTitleMatched(node, TEXTS.LIHKG_USER_CARD_MODAL_TITLE);
};

const isSettingsModal = (node: Element) => {
  return isModalTitleMatched(node, TEXTS.LIHKG_SETTINGS_MODAL_TITLE);
};

const isEmoteMenu = (node: Element) => {
  return node.matches(lihkgSelectors.emoteMenu);
};

export const isNickname = (node: Element) => {
  return node.matches(`.${lihkgCssClasses.nickname}`);
};

const querySelectorAllNickname = (node: Element) => {
  return node.querySelectorAll(`.${lihkgCssClasses.nickname}`);
};

const querySelectorNicknameLink = (node: Element) => {
  const nicknameLinkSelector = `.${lihkgCssClasses.nickname} > a[href^="/profile"]`;
  return node.querySelector<HTMLAnchorElement>(nicknameLinkSelector);
};

// const querySelectorAllReplyBody = (node: Element) => {
//   return node.querySelectorAll(`.${lihkgCssClasses.replyBody}`);
// };

const isModalTitleMatched = (node: Element, title: string) => {
  if (node.matches(`.${lihkgCssClasses.modal}`)) {
    const modalTitle = node.querySelector(`.${lihkgCssClasses.modalTitle}`);
    if (modalTitle) {
      return modalTitle.textContent === title;
    }
  }
  return false;
};

const renderAddLabelButton = (user: string, store: Store, container: TRendererContainer) => {
  const postID = cache.targetReply?.getAttribute(ATTRIBUTES.dataPostId)!;
  const targetReply = cache.getReply(postID);
  if (targetReply) {
    ReactDOM.render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AddLabelButton user={user} targetReply={targetReply}>
            {TEXTS.ADD_LABEL_BUTTON_TEXT}
          </AddLabelButton>
        </PersistGate>
      </Provider>,
      container
    );
  }
};

const renderLabelList = (user: string, store: Store, hasSnipeButton: boolean, container: TRendererContainer) => {
  (container as Element).classList.add(labelListStyles.container);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LabelList user={user} hasSnipeButton={hasSnipeButton} />
      </PersistGate>
    </Provider>,
    container
  );
};

const renderLabelBook = (user: string, store: Store, container: TRendererContainer) => {
  (container as Element).classList.add(lihkgCssClasses.threadHeadingText);
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LabelBook user={user} />
      </PersistGate>
    </Provider>,
    container
  );
};

const renderSettingSection = (store: Store, container: TRendererContainer) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SettingSection />
      </PersistGate>
    </Provider>,
    container
  );
};

const renderUnlockIconMapToggleButton = (store: Store, container: TRendererContainer) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <UnlockIconMapToggleButton />
      </PersistGate>
    </Provider>,
    container
  );
};

export const renderAnnouncement = async (announcement: React.ReactElement) => {
  const container = document.createElement('div');
  container.classList.add(announcementStyles.container);
  const rightPanelContainer = await waitForRightPanelContainer();
  rightPanelContainer?.insertBefore(container, rightPanelContainer.firstChild);
  ReactDOM.render(announcement, container);
};

const handleThread = (node: Element, store: Store) => {
  // const node =node
  const threadLink = node.querySelector(`.${lihkgCssClasses.threadLink}`)!;
  const href = threadLink.getAttribute('href')!;
  const threadId = href.match(REGEXES.THREAD_URL)![1];
  const thread = cache.getThread(threadId);
  if (thread) {
    const { user_id: user } = thread;
    const threadUsername = node.querySelector(`.${lihkgCssClasses.threadUsername}`)!;
    const labelBookContainer = document.createElement('div');
    insertAfter(labelBookContainer, threadUsername);
    renderLabelBook(user, store, labelBookContainer);
  }
};

const handleUserCardModal = (node: Element, store: Store) => {
  const doxButtonSelector = `.${lihkgCssClasses.userCardButtonsContainer} > a[href^="/profile"]`;
  const doxButton = node.querySelector(doxButtonSelector);
  const href = doxButton?.getAttribute('href');
  const matched = href?.match(REGEXES.PROFILE_URL);
  if (matched) {
    const [, user] = matched;
    const modelContentInner = node.querySelector(`.${lihkgCssClasses.modalContent} > div`)!;
    const labelListContainer = document.createElement('div');
    modelContentInner.appendChild(labelListContainer);
    renderLabelList(user, store, false, labelListContainer);
    const userCardButtonsContainer = node.querySelector(`.${lihkgCssClasses.userCardButtonsContainer}`)!;
    const addLabelButtonContainer = document.createElement('div');
    addLabelButtonContainer.classList.add(addLabelButtonStyles.container);
    userCardButtonsContainer.appendChild(addLabelButtonContainer);
    renderAddLabelButton(user, store, addLabelButtonContainer);
  }
};

const handleSettingsModal = (node: Element, store: Store) => {
  const modelContentInner = node.querySelector(`.${lihkgCssClasses.modalContent} > div`)!;
  const container = document.createElement('div');
  container.classList.add(settingSectionStyles.container);
  modelContentInner.appendChild(container);
  renderSettingSection(store, container);
};

const handleEmoteMenu = (node: Element, store: Store) => {
  const toolbar = node.querySelector(lihkgSelectors.emoteMenuToolbar);
  const container = document.createElement('div');
  container.classList.add(unlockIconMapToggleButtonStyles.container);
  toolbar!.appendChild(container);
  renderUnlockIconMapToggleButton(store, container);
};

export const handleNicknames = (node: Element, store: Store) => {
  const nodes = Array.from(querySelectorAllNickname(node));
  for (const node of nodes) {
    handleNickname(node, store);
  }
};

const handleNickname = (node: Element, store: Store) => {
  const nicknameLink = querySelectorNicknameLink(node);
  if (nicknameLink) {
    const href = nicknameLink.getAttribute('href')!;
    const matched = href.match(REGEXES.PROFILE_URL);
    if (matched) {
      const containerCacheKey = `__${namespace}__cache__container__`;
      const [, user] = matched;
      (node as any)[containerCacheKey]?.remove();
      const container = document.createElement('div');
      insertAfter(container, node);
      renderLabelList(user, store, true, container);
      (node as any)[containerCacheKey] = container;
    }
  }
};

// export const handleReplyBodies = (node: Element, store: Store) => {
//   const nodes = Array.from(querySelectorAllReplyBody(node));
//   for (const node of nodes) {
//     handleReplyBody(node, store);
//   }
// };

// const handleReplyBody = (node: Element, store: Store) => {
//   const nicknameLink = querySelectorNicknameLink(node);
//   if (nicknameLink) {
//     const href = nicknameLink.getAttribute('href')!;
//     const matched = href.match(REGEXES.PROFILE_URL);
//     if (matched) {
//       const containerCacheKey = `__${namespace}__cache__container__`;
//       const [, user] = matched;
//       (node as any)[containerCacheKey]?.remove();
//       const container = document.createElement('div');
//       // insertAfter(container, node);
//       node.insertBefore(container, node.firstChild!);
//       renderLabelList(user, store, true, container);
//       (node as any)[containerCacheKey] = container;
//     }
//   }
// };

export const mutationHandlerFactory = (node: Element) => {
  if (isThread(node)) return handleThread;
  if (isUserCardModal(node)) return handleUserCardModal;
  if (isSettingsModal(node)) return handleSettingsModal;
  if (isEmoteMenu(node)) return handleEmoteMenu;
  return handleNicknames;
};

export const waitForSubmissionForm = () => {
  return waitForElement(`.${lihkgCssClasses.submissionForm}`);
};

const waitForRightPanelContainer = async () => {
  const splitView = await waitForElement(lihkgSelectors.splitView);
  return splitView.querySelector(`.${lihkgCssClasses.rightPanelContainer}`)!;
};

/**
 * get the original LIHKG redux store
 */
export const getStore = () => {
  const app = document.querySelector(lihkgSelectors.app);
  const store = findReduxStore(app as IReactRootElement);
  return store;
};

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
 * get the share id of the reply
 * @copyright the implementation is a reference from LIHKG source code
 * @param {ISource} post the label source 
 * @returns the share id
 */
export const getShareId = (post: TTracablePost) => {
  const e = post.thread_id; // thread id
  if (post.msg_num === '1') {
    return e;
  }
  const t = ShareType.Reply; // the share type: thread or reply
  const n = parseInt(post.msg_num, 10); // the share variable: page number or message number
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
  // since `type > 0` will always be `true`
  // this will neven happen, but just keep this for consistency
  return C(parseInt(e, 10), 'abcdefghijkmnopqrstuvwxyz');
};
