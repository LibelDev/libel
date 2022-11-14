import type { useFloating } from '@floating-ui/react-dom';
import debugFactory from 'debug';
import type React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import type { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { namespace } from '../../package.json';
import cache from '../cache';
import AddLabelButton, { styles as addLabelButtonStyles } from '../components/AddLabelButton/AddLabelButton';
import { styles as announcementStyles } from '../components/Announcement/Announcement';
import { IconName } from '../components/Icon/types';
import LabelList, { styles as labelListStyles } from '../components/LabelList/LabelList';
import SettingsModalToggleButton from '../components/SettingsModalToggleButton/SettingsModalToggleButton';
import SnipeButton, { styles as snipeButtonStyles } from '../components/SnipeButton/SnipeButton';
import SourcePostScreenshotButton, { styles as sourcePostScreenshotButtonStyles } from '../components/SourcePostScreenshotButton/SourcePostScreenshotButton';
import UnlockIconMapToggleButton, { styles as unlockIconMapToggleButtonStyles } from '../components/UnlockIconMapToggleButton/UnlockIconMapToggleButton';
import UserInfo, { createContainer as createUserInfoContainer } from '../components/UserInfo/UserInfo';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import * as TEXTS from '../constants/texts';
import { Context as LabelSourcePostContext } from '../hooks/useLabelSourcePost';
import { Context as UnlockedIconMapContext } from '../hooks/useUnlockedIconMap';
import type { TStore } from '../store/store';
import lihkgCssClasses from '../stylesheets/variables/lihkg/classes.module.scss';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.module.scss';
import { insertAfter } from './dom';
import * as LIHKG from './lihkg';

type TFloatingConfig = Parameters<typeof useFloating>[0];

const debug = debugFactory('libel:helper:mutation');

const userInfoMutationCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const labelListMutationCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const snipeButtonMutationCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const addLabelButtonMutationCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const sourcePostScreenshotButtonMutationCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);

type TMutationCacheSymbol = (
  typeof userInfoMutationCacheSymbol |
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
    [userInfoMutationCacheSymbol]?: IMutationCache;
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

const renderUserInfo = (userId: string, container: Element) => {
  const user = userId && cache.getUser(userId) || null;
  const root = createRoot(container);
  if (user) {
    root.render(
      <UserInfo user={user} />
    );
  }
  return root;
};

const renderLabelList = (user: string, postId: string | undefined, floatingConfig: TFloatingConfig, store: TStore, persistor: Persistor, container: Element) => {
  container.classList.add(labelListStyles.container);
  const post = postId && cache.getReply(postId) || null;
  const iconMap = LIHKG.getUnlockedIconMap();
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <LabelSourcePostContext.Provider value={post}>
          <UnlockedIconMapContext.Provider value={iconMap}>
            <LabelList
              user={user}
              floatingConfig={floatingConfig}
            />
          </UnlockedIconMapContext.Provider>
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
  const rightPanelContainer = await LIHKG.waitForRightPanelContainer();
  rightPanelContainer?.insertBefore(container, rightPanelContainer.firstChild);
  const root = createRoot(container);
  root.render(announcement);
  return root;
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
    _handleReplyItemInnerBodyHeadingMutation(replyItemInnerBodyHeading, store, persistor);
  }
};

const handleReplyButtonMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const replyItemInnerBodyHeading = node.parentElement!;
  _handleReplyItemInnerBodyHeadingMutation(replyItemInnerBodyHeading, store, persistor);
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

/**
 * handle unmountable mutation
 * @description unmount the root and remove the container from the previous mutation, then attach new mutation cache
 * @private
 */
const _handleUnmountableMutation: TUnmontableMutationHandler = (node, symbol, render) => {
  node[symbol]?.root.unmount();
  node[symbol]?.container.remove();
  const cache = render(node);
  node[symbol] = cache;
  return cache;
};

/**
 * centralized mutation handler
 * @description handle mutation in one go and share some necessary common variables
 * @private
 */
const _handleReplyItemInnerBodyHeadingMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const user = getUserIDFromNode(node);
  if (user) {
    const replyItemInner = node.parentElement?.parentElement;
    const replyItemInnerBody = node.parentElement;
    const replyButton = node.querySelector(`.${IconName.Reply}`);
    const postId = replyItemInner?.getAttribute(ATTRIBUTES.DATA_POST_ID) || undefined;
    if (replyItemInner) {
      /* user info */
      _handleUnmountableMutation(replyItemInner, userInfoMutationCacheSymbol, (reference) => {
        const container = createUserInfoContainer();
        reference.insertBefore(container, reference.firstChild);
        const root = renderUserInfo(user, container);
        return { container, root };
      });
    }
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

/** mutation handler factory */
export const createAddedNodeMutationHandler = (node: Element) => {
  debug('addedNodeMutationHandlerFactory', node);
  /** when render the drawer */
  if (isDrawer(node)) return handleDrawerMutation;
  /** when render the thread item */
  if (isThreadItem(node)) return handleThreadItemMutation;
  /** when render the user card modal */
  if (isUserCardModal(node)) return handleUserCardModalMutation;
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
