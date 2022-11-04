import type { useFloating } from '@floating-ui/react-dom';
import debugFactory from 'debug';
import type React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import type { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { namespace } from '../../package.json';
import cache from '../cache';
import AddLabelButton from '../components/AddLabelButton/AddLabelButton';
import addLabelButtonStyles from '../components/AddLabelButton/AddLabelButton.module.scss';
import announcementStyles from '../components/Announcement/Announcement.module.scss';
import { IconName } from '../components/Icon/types';
import LabelList from '../components/LabelList/LabelList';
import labelListStyles from '../components/LabelList/LabelList.module.scss';
// import Settings from '../components/Settings/Settings';
// import settingsStyles from '../components/Settings/Settings.module.scss';
import SettingsModalToggleButton from '../components/SettingsModalToggleButton/SettingsModalToggleButton';
import SnipeButton from '../components/SnipeButton/SnipeButton';
import snipeButtonStyles from '../components/SnipeButton/SnipeButton.module.scss';
import SourcePostScreenshotButton from '../components/SourcePostScreenshotButton/SourcePostScreenshotButton';
import sourcePostScreenshotButtonStyles from '../components/SourcePostScreenshotButton/SourcePostScreenshotButton.module.scss';
import UnlockIconMapToggleButton from '../components/UnlockIconMapToggleButton/UnlockIconMapToggleButton';
import unlockIconMapToggleButtonStyles from '../components/UnlockIconMapToggleButton/UnlockIconMapToggleButton.module.scss';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import * as TEXTS from '../constants/texts';
import { Context as LabelSourcePostContext } from '../hooks/useLabelSourcePost';
import type { TStore } from '../store/store';
import lihkgCssClasses from '../stylesheets/variables/lihkg/classes.module.scss';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.module.scss';
import { insertAfter } from './dom';
import { waitForRightPanelContainer } from './lihkg';

type TFloatingConfig = Parameters<typeof useFloating>[0];

const debug = debugFactory('libel:helper:mutation');

const labelListMutationCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const snipeButtonMutationCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const addLabelButtonMutationCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const sourcePostScreenshotButtonMutationCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);

type TMutationCacheSymbol = (
  typeof labelListMutationCacheSymbol |
  typeof snipeButtonMutationCacheSymbol |
  typeof addLabelButtonMutationCacheSymbol |
  typeof sourcePostScreenshotButtonMutationCacheSymbol
);

interface IMutationCache {
  container: HTMLElement;
  root: Root;
}

type TUnmontableMutationHandler = (
  /** the reference element to attach the mutation cache */
  reference: Element,
  /** the cache symbol key */
  cacheSymbol: TMutationCacheSymbol,
  render: (reference: Element) => IMutationCache
) => IMutationCache;

declare global {
  interface Element {
    [labelListMutationCacheSymbol]?: IMutationCache;
    [snipeButtonMutationCacheSymbol]?: IMutationCache;
    [addLabelButtonMutationCacheSymbol]?: IMutationCache;
    [sourcePostScreenshotButtonMutationCacheSymbol]?: IMutationCache;
  }
}

const isDrawer = (node: Element) => {
  return node.matches(lihkgSelectors.drawer);
};

const isThreadItem = (node: Element) => {
  return node.matches(lihkgSelectors.threadItem);
};

const isUserCardModal = (node: Element) => {
  return isModalTitleMatched(node, TEXTS.LIHKG_MODAL_TITLE_USER_CARD);
};

// const isSettingsModal = (node: Element) => {
//   return isModalTitleMatched(node, TEXTS.LIHKG_SETTINGS_MODAL_TITLE);
// };

const isEmoteMenu = (node: Element) => {
  return node.matches(lihkgSelectors.emoteMenu);
};

const isReplyList = (node: Element) => {
  return node.matches(lihkgSelectors.replyList);
};

const isReplyItem = (node: Element) => {
  return node.matches(lihkgSelectors.replyItem);
};

const isReplyItemInner = (node: Element) => {
  return node.matches(lihkgSelectors.replyItemInner);
};

const isReplyItemInnerBody = (node: Element) => {
  return node.matches(lihkgSelectors.replyItemInnerBody);
};

const isReplyButton = (node: Element) => {
  return node.matches(`.${IconName.Reply}`);
};

const isReplyModal = (node: Element) => {
  return node.matches(lihkgSelectors.replyModal);
};

export const isNickname = (node: Element) => {
  return node.matches(lihkgSelectors.nickname);
};

const getUserIDFromNode = (node: Element) => {
  const nicknameLinkSelector = `${lihkgSelectors.nickname} > a[href^="/profile"]`;
  const nicknameLink = node.querySelector<HTMLAnchorElement>(nicknameLinkSelector);
  const href = nicknameLink?.getAttribute('href');
  const matched = href?.match(REGEXES.PROFILE_URL);
  if (matched) {
    return matched[1];
  }
};

const isModalTitleMatched = (node: Element, title: string) => {
  if (node.matches(lihkgSelectors.modal)) {
    const modalTitle = node.querySelector(lihkgSelectors.modalTitle);
    if (modalTitle) {
      return modalTitle.textContent === title;
    }
  }
  return false;
};

const renderSettingsModalToggleButton = (store: TStore, persistor: Persistor, container: Element) => {
  container.classList.add(lihkgCssClasses.drawerSidebarItem);
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SettingsModalToggleButton />
      </PersistGate>
    </Provider>
  );
  return root;
};

const renderLabelList = (user: string, postId: string | undefined, floatingConfig: TFloatingConfig, store: TStore, persistor: Persistor, container: Element) => {
  container.classList.add(labelListStyles.container);
  const post = postId && cache.getReply(postId) || null;
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LabelSourcePostContext.Provider value={post}>
          <LabelList
            user={user}
            floatingConfig={floatingConfig}
          />
        </LabelSourcePostContext.Provider>
      </PersistGate>
    </Provider>
  );
  return root;
};

const renderAddLabelButton = (user: string, postId: string | undefined, store: TStore, persistor: Persistor, container: Element) => {
  container.classList.add(lihkgCssClasses.replyToolbarButton);
  container.classList.add(addLabelButtonStyles.container);
  const post = postId && cache.getReply(postId) || null;
  const root = createRoot(container);
  if (post) {
    root.render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <LabelSourcePostContext.Provider value={post}>
            <AddLabelButton user={user} />
          </LabelSourcePostContext.Provider>
        </PersistGate>
      </Provider>
    );
  }
  return root;
};

const renderSnipeButton = (user: string, store: TStore, persistor: Persistor, container: Element) => {
  container.classList.add(lihkgCssClasses.replyToolbarButton);
  container.classList.add(snipeButtonStyles.container);
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SnipeButton user={user} />
      </PersistGate>
    </Provider>
  );
  return root;
};

const renderSourcePostScreenshotButton = (user: string, postId: string | undefined, store: TStore, persistor: Persistor, container: Element) => {
  container.classList.add(lihkgCssClasses.replyToolbarButton);
  container.classList.add(sourcePostScreenshotButtonStyles.container);
  const post = postId && cache.getReply(postId) || null;
  const root = createRoot(container);
  if (post) {
    root.render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SourcePostScreenshotButton post={post} />
        </PersistGate>
      </Provider>
    );
  }
  return root;
};

// const renderSettings = (store: TStore, persistor: Persistor, container: Element) => {
//   container.classList.add(settingsStyles.container);
//   const root = createRoot(container);
//   root.render(
//     <Provider store={store}>
//       <PersistGate persistor={persistor}>
//         <Settings />
//       </PersistGate>
//     </Provider>
//   );
//   return root;
// };

const renderUnlockIconMapToggleButton = (store: TStore, persistor: Persistor, container: Element) => {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <UnlockIconMapToggleButton />
      </PersistGate>
    </Provider>
  );
  return root;
};

export const renderAnnouncement = async (announcement: React.ReactElement) => {
  const container = document.createElement('div');
  container.classList.add(announcementStyles.container);
  const rightPanelContainer = await waitForRightPanelContainer();
  rightPanelContainer?.insertBefore(container, rightPanelContainer.firstChild);
  const root = createRoot(container);
  root.render(announcement);
  return root;
};

/**
 * handle unmountable mutation
 * @description unmount the root and remove the container from the previous mutation, then attach new mutation cache
 * @private
 */
const _handleUnmountableMutation: TUnmontableMutationHandler = (reference, symbol, render) => {
  reference[symbol]?.root.unmount();
  reference[symbol]?.container.remove();
  const cache = render(reference);
  reference[symbol] = cache;
  return cache;
};

const handleDrawerMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const drawerSidebarTopItemsContainer = node.querySelector(lihkgSelectors.drawerSidebarTopItemsContainer);
  if (drawerSidebarTopItemsContainer) {
    const container = document.createElement('div');
    drawerSidebarTopItemsContainer.appendChild(container);
    renderSettingsModalToggleButton(store, persistor, container);
  }
};

const handleThreadItemMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const threadLink = node.querySelector(lihkgSelectors.threadLink);
  const href = threadLink?.getAttribute('href');
  const threadId = href?.match(REGEXES.THREAD_URL)![1];
  if (threadId) {
    const thread = cache.getThread(threadId);
    if (thread) {
      const { user_id: user } = thread;
      const threadItemInner = node.querySelector(lihkgSelectors.threadItemInner);
      if (threadItemInner) {
        const container = document.createElement('div');
        threadItemInner.insertAdjacentElement('afterbegin', container);
        renderLabelList(user, undefined, undefined, store, persistor, container);
      }
    }
  }
};

const handleUserCardModalMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const doxButtonSelector = `${lihkgSelectors.userCardButtonsContainer} > a[href^="/profile"]`;
  const doxButton = node.querySelector(doxButtonSelector);
  const href = doxButton?.getAttribute('href');
  const matched = href?.match(REGEXES.PROFILE_URL);
  if (matched) {
    const [, user] = matched;
    const modelContentInner = node.querySelector(`${lihkgSelectors.modalContent} > div`);
    if (modelContentInner) {
      const container = document.createElement('div');
      modelContentInner.appendChild(container);
      const floatingConfig: TFloatingConfig = { strategy: 'fixed' };
      renderLabelList(user, undefined, floatingConfig, store, persistor, container);
    }
  }
};

// const handleSettingsModalMutation = (node: Element, store: TStore, persistor: Persistor) => {
//   const modelContentInner = node.querySelector(`${lihkgSelectors.modalContent} > div`);
//   if (modelContentInner) {
//     const container = document.createElement('div');
//     modelContentInner.appendChild(container);
//     renderSettings(store, persistor, container);
//   }
// };

const handleEmoteMenuMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const toolbar = node.querySelector(lihkgSelectors.emoteMenuToolbar);
  const container = document.createElement('div');
  container.classList.add(unlockIconMapToggleButtonStyles.container);
  toolbar!.appendChild(container);
  renderUnlockIconMapToggleButton(store, persistor, container);
};

const handleReplyListMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const nodes = Array.from(node.querySelectorAll(lihkgSelectors.replyItem));
  for (const node of nodes) {
    handleReplyItemMutation(node, store, persistor);
  }
};

const handleReplyItemMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const replyItemInner = node.querySelector(lihkgSelectors.replyItemInner);
  if (replyItemInner) {
    handleReplyItemInnerMutation(replyItemInner, store, persistor);
  }
};

const handleReplyItemInnerMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const replyItemInnerBody = node.querySelector(lihkgSelectors.replyItemInnerBody);
  if (replyItemInnerBody) {
    handleReplyItemInnerBodyMutation(replyItemInnerBody, store, persistor);
  }
};

const handleReplyItemInnerBodyMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const replyItemInnerBodyHeading = node.querySelector(lihkgSelectors.replyItemInnerBodyHeading);
  if (replyItemInnerBodyHeading) {
    handleReplyItemInnerBodyHeadingMutation(replyItemInnerBodyHeading, store, persistor);
  }
};

const handleReplyItemInnerBodyHeadingMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const user = getUserIDFromNode(node);
  if (user) {
    const replyItemInner = node.parentElement?.parentElement;
    const postId = replyItemInner?.getAttribute(ATTRIBUTES.DATA_POST_ID) || undefined;
    const replyItemInnerBody = node.parentElement;
    if (replyItemInnerBody) {
      /* label list */
      _handleUnmountableMutation(replyItemInnerBody, labelListMutationCacheSymbol, (reference) => {
        const container = document.createElement('div');
        reference.insertAdjacentElement('afterbegin', container);
        const floatingConfig: TFloatingConfig = { strategy: 'absolute' };
        const root = renderLabelList(user, postId, floatingConfig, store, persistor, container);
        return { container, root };
      });
    }
    const replyButton = node.querySelector(`.${IconName.Reply}`);
    if (replyButton) {
      /* snipe button */
      _handleUnmountableMutation(replyButton, snipeButtonMutationCacheSymbol, (reference) => {
        const container = document.createElement('div');
        insertAfter(container, reference);
        const root = renderSnipeButton(user, store, persistor, container);
        return { container, root };
      });
      /* add label button */
      _handleUnmountableMutation(replyButton, addLabelButtonMutationCacheSymbol, (reference) => {
        const container = document.createElement('div');
        insertAfter(container, reference);
        const root = renderAddLabelButton(user, postId, store, persistor, container);
        return { container, root };
      });
      /* source post screenshot button */
      _handleUnmountableMutation(replyButton, sourcePostScreenshotButtonMutationCacheSymbol, (reference) => {
        const container = document.createElement('div');
        insertAfter(container, reference);
        const root = renderSourcePostScreenshotButton(user, postId, store, persistor, container);
        return { container, root };
      });
    }
  }
};

const handleReplyButtonMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const replyItemInnerBodyHeading = node.parentElement!;
  handleReplyItemInnerBodyHeadingMutation(replyItemInnerBodyHeading, store, persistor);
};


const handleReplyModalMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const replyItemInner = node.querySelector(lihkgSelectors.replyItemInner);
  if (replyItemInner) {
    handleReplyItemInnerMutation(replyItemInner, store, persistor);
  }
};

export const handleDataPostIdAttributeMutation = (node: Element, store: TStore, persistor: Persistor) => {
  handleReplyItemInnerMutation(node, store, persistor);
};

export const addedNodeMutationHandlerFactory = (node: Element) => {
  debug('addedNodeMutationHandlerFactory', node);
  /** when render the drawer */
  if (isDrawer(node)) return handleDrawerMutation;
  /** when render the thread item */
  if (isThreadItem(node)) return handleThreadItemMutation;
  /** when render the user card modal */
  if (isUserCardModal(node)) return handleUserCardModalMutation;
  // /** when render the settings modal */
  // if (isSettingsModal(node)) return handleSettingsModalMutation;
  /** when render the emote menu */
  if (isEmoteMenu(node)) return handleEmoteMenuMutation;
  /** when render the reply list (probably when enter the thread or go to next page) */
  if (isReplyList(node)) return handleReplyListMutation;
  /** when render the reply item (probably switch to another thread or inside the reply modal) */
  if (isReplyItem(node)) return handleReplyItemMutation;
  /** when render the reply item in reply modal*/
  if (isReplyItemInner(node)) return handleReplyItemInnerMutation;
  /** when show blocked user reply item */
  if (isReplyItemInnerBody(node)) return handleReplyItemInnerBodyMutation;
  /** when expand the short reply item */
  if (isReplyButton(node)) return handleReplyButtonMutation;
  /** when render reply modal */
  if (isReplyModal(node)) return handleReplyModalMutation;
};
