import type { useFloating } from '@floating-ui/react-dom';
import debugFactory from 'debug';
import type React from 'react';
import { createRoot, Root } from 'react-dom/client';
import type { Persistor } from 'redux-persist';
import { namespace } from '../../package.json';
import cache from '../cache';
import AddLabelButton, { createContainer as createAddLabelButtonContainer } from '../components/AddLabelButton/AddLabelButton';
import { createContainer as createAnnouncementContainer } from '../components/Announcement/Announcement';
import BlockquoteMessageInfo, { createContainer as createBlockquoteMessageInfoContainer } from '../components/BlockquoteMessageInfo/BlockquoteMessageInfo';
import { IconName } from '../components/Icon/types';
import LabelList, { createContainer as createLabelListContainer } from '../components/LabelList/LabelList';
import Provider from '../components/Provider/Provider';
import SettingsModalToggleButton, { createContainer as createSettingsModalToggleButtonContainer } from '../components/SettingsModalToggleButton/SettingsModalToggleButton';
import SnipeButton, { createContainer as createSnipeButtonContainer } from '../components/SnipeButton/SnipeButton';
import SourcePostScreenshotButton, { createContainer as createSourcePostScreenshotButtonContainer } from '../components/SourcePostScreenshotButton/SourcePostScreenshotButton';
import UnlockIconMapToggleButton, { createContainer as createUnlockIconMapToggleButtonContainer } from '../components/UnlockIconMapToggleButton/UnlockIconMapToggleButton';
import UserInfo, { createContainer as createUserInfoContainer } from '../components/UserInfo/UserInfo';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import * as TEXTS from '../constants/texts';
import { Context as LabelSourcePostContext } from '../hooks/useLabelSourcePost';
import { Context as UnlockedIconMapContext } from '../hooks/useUnlockedIconMap';
import type { TStore } from '../store/store';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.module.scss';
import type { IPost, IUser } from '../types/lihkg';
import { insertAfter } from './dom';
import * as LIHKG from './lihkg';

type TFloatingConfig = Parameters<typeof useFloating>[0];

const debug = debugFactory('libel:helper:mutation');

const userInfoRenderCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const labelListRenderCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const snipeButtonRenderCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const addLabelButtonRenderCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const sourcePostScreenshotButtonRenderCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);
const blockquoteMessageInfoRenderCacheSymbol: unique symbol = Symbol(`__${namespace}__cache__`);

type TRenderCacheSymbol = (
  typeof userInfoRenderCacheSymbol |
  typeof labelListRenderCacheSymbol |
  typeof snipeButtonRenderCacheSymbol |
  typeof addLabelButtonRenderCacheSymbol |
  typeof sourcePostScreenshotButtonRenderCacheSymbol |
  typeof blockquoteMessageInfoRenderCacheSymbol
);

interface IRenderCache {
  container: HTMLElement;
  root: Root;
}

type TUnmountableRenderer = (
  /** the reference element to attach the mutation cache */
  node: Element,
  /** the symbol key to save the cache */
  symbol: TRenderCacheSymbol,
  render: (node: Element) => IRenderCache
) => IRenderCache;

declare global {
  interface Element {
    [userInfoRenderCacheSymbol]?: IRenderCache;
    [labelListRenderCacheSymbol]?: IRenderCache;
    [snipeButtonRenderCacheSymbol]?: IRenderCache;
    [addLabelButtonRenderCacheSymbol]?: IRenderCache;
    [sourcePostScreenshotButtonRenderCacheSymbol]?: IRenderCache;
    [blockquoteMessageInfoRenderCacheSymbol]?: IRenderCache;
  }
}

const elementPostIdMapping = new Map<Element, string>();

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

const isReplyItemInnerBodyContent = (node: Element) => {
  return node.matches(lihkgSelectors.replyItemInnerBodyContent);
};

const isReplyButton = (node: Element) => {
  return node.matches(`.${IconName.Reply}`);
};

const isReplyModal = (node: Element) => {
  return node.matches(lihkgSelectors.replyModal);
};

const isBlockquote = (node: Element | null) => {
  return node?.matches(lihkgSelectors.blockquote) || false;
};

const getUserIDFromNode = (node: Element) => {
  const nicknameLinkSelector = `${lihkgSelectors.nickname} > a[href^="/profile"]`;
  const nicknameLink = node.querySelector<HTMLAnchorElement>(nicknameLinkSelector);
  const href = nicknameLink?.getAttribute('href');
  const matched = href?.match(REGEXES.PROFILE_URL);
  return matched && matched[1];
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
  const root = createRoot(container);
  root.render(
    <Provider cache={cache} store={store} persistor={persistor}>
      <SettingsModalToggleButton />
    </Provider>
  );
  return root;
};

const renderUserInfo = (user: IUser, container: Element) => {
  const root = createRoot(container);
  root.render(
    <UserInfo user={user} />
  );
  return root;
};

const renderLabelList = (user: string, post: IPost | null, floatingConfig: TFloatingConfig, store: TStore, persistor: Persistor, container: Element) => {
  const iconMap = LIHKG.getUnlockedIconMap();
  const root = createRoot(container);
  root.render(
    <Provider cache={cache} store={store} persistor={persistor}>
      <LabelSourcePostContext.Provider value={post}>
        <UnlockedIconMapContext.Provider value={iconMap}>
          <LabelList
            user={user}
            floatingConfig={floatingConfig}
          />
        </UnlockedIconMapContext.Provider>
      </LabelSourcePostContext.Provider>
    </Provider>
  );
  return root;
};

const renderAddLabelButton = (user: string, post: IPost | null, store: TStore, persistor: Persistor, container: Element) => {
  const root = createRoot(container);
  if (post) {
    root.render(
      <Provider cache={cache} store={store} persistor={persistor}>
        <LabelSourcePostContext.Provider value={post}>
          <AddLabelButton user={user} />
        </LabelSourcePostContext.Provider>
      </Provider>
    );
  }
  return root;
};

const renderSnipeButton = (user: string, store: TStore, persistor: Persistor, container: Element) => {
  const root = createRoot(container);
  root.render(
    <Provider cache={cache} store={store} persistor={persistor}>
      <SnipeButton user={user} />
    </Provider>
  );
  return root;
};

const renderSourcePostScreenshotButton = (user: string, post: IPost | null, store: TStore, persistor: Persistor, container: Element) => {
  const root = createRoot(container);
  if (post) {
    root.render(
      <Provider cache={cache} store={store} persistor={persistor}>
        <SourcePostScreenshotButton post={post} />
      </Provider>
    );
  }
  return root;
};

const renderUnlockIconMapToggleButton = (store: TStore, persistor: Persistor, container: Element) => {
  const root = createRoot(container);
  root.render(
    <Provider cache={cache} store={store} persistor={persistor}>
      <UnlockIconMapToggleButton />
    </Provider>
  );
  return root;
};

const renderBlockquoteMessageInfo = (post: IPost, inline: boolean | undefined, container: Element) => {
  const root = createRoot(container);
  root.render(
    <BlockquoteMessageInfo
      post={post}
      inline={inline}
    />
  );
  return root;
};

export const renderAnnouncement = async (announcement: React.ReactElement) => {
  const container = createAnnouncementContainer();
  const rightPanelContainer = await LIHKG.waitForRightPanelContainer();
  rightPanelContainer.insertAdjacentElement('afterbegin', container);
  const root = createRoot(container);
  root.render(announcement);
  return root;
};

const handleDrawerMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const drawerSidebarTopItemsContainer = node.querySelector(lihkgSelectors.drawerSidebarTopItemsContainer);
  if (drawerSidebarTopItemsContainer) {
    const container = createSettingsModalToggleButtonContainer();
    drawerSidebarTopItemsContainer.appendChild(container);
    renderSettingsModalToggleButton(store, persistor, container);
  }
};

const handleThreadItemMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const threadLink = node.querySelector(lihkgSelectors.threadLink);
  const href = threadLink?.getAttribute('href');
  const threadId = href?.match(REGEXES.THREAD_URL)![1];
  const thread = cache.getThread(threadId);
  if (thread) {
    const { user_id: user } = thread;
    const threadItemInner = node.querySelector(lihkgSelectors.threadItemInner);
    if (threadItemInner) {
      const container = createLabelListContainer();
      threadItemInner.insertAdjacentElement('afterbegin', container);
      renderLabelList(user, null, undefined, store, persistor, container);
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
      const container = createLabelListContainer();
      modelContentInner.appendChild(container);
      const floatingConfig: TFloatingConfig = { strategy: 'fixed' };
      renderLabelList(user, null, floatingConfig, store, persistor, container);
    }
  }
};

const handleEmoteMenuMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const toolbar = node.querySelector(lihkgSelectors.emoteMenuToolbar);
  const container = createUnlockIconMapToggleButtonContainer();
  toolbar!.appendChild(container);
  renderUnlockIconMapToggleButton(store, persistor, container);
};

const handleReplyListMutation = (node: Element, store: TStore, persistor: Persistor) => {
  /* drill down */
  const nodes = Array.from(node.querySelectorAll(lihkgSelectors.replyItem));
  for (const node of nodes) {
    handleReplyItemMutation(node, store, persistor);
  }
};

const handleReplyItemMutation = (node: Element, store: TStore, persistor: Persistor) => {
  /* drill down */
  const replyItemInner = node.querySelector(lihkgSelectors.replyItemInner);
  if (replyItemInner) {
    handleReplyItemInnerMutation(replyItemInner, store, persistor);
  }
};

const handleReplyItemInnerMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const userId = getUserIDFromNode(node);
  const user = cache.getUser(userId);
  if (user) {
    /* user info */
    _handleUnmountableRender(node, userInfoRenderCacheSymbol, (node) => {
      const container = createUserInfoContainer();
      node.insertAdjacentElement('afterbegin', container);
      const root = renderUserInfo(user, container);
      return { container, root };
    });
  }
  /* drill down */
  const replyItemInnerBody = node.querySelector(lihkgSelectors.replyItemInnerBody);
  if (replyItemInnerBody) {
    handleReplyItemInnerBodyMutation(replyItemInnerBody, store, persistor);
  }
};

const handleReplyItemInnerBodyMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const user = getUserIDFromNode(node);
  const postId = node.parentElement?.getAttribute(ATTRIBUTES.DATA_POST_ID);
  const post = cache.getReply(postId);
  if (user && post) {
    /* label list */
    _handleUnmountableRender(node, labelListRenderCacheSymbol, (node) => {
      const container = createLabelListContainer();
      node.insertAdjacentElement('afterbegin', container);
      const floatingConfig: TFloatingConfig = { strategy: 'absolute' };
      const root = renderLabelList(user, post, floatingConfig, store, persistor, container);
      return { container, root };
    });
  }
  /* drill down */
  const replyItemInnerBodyHeading = node.querySelector(lihkgSelectors.replyItemInnerBodyHeading);
  if (replyItemInnerBodyHeading) {
    handleReplyItemInnerBodyHeadingMutation(replyItemInnerBodyHeading, store, persistor);
  }
  const replyItemInnerBodyContent = node.querySelector(lihkgSelectors.replyItemInnerBodyContent);
  if (replyItemInnerBodyContent) {
    handleReplyItemInnerBodyContentMutation(replyItemInnerBodyContent);
  }
  const inlineBlockquote = node.querySelector(lihkgSelectors.inlineBlockquote);
  if (inlineBlockquote) {
    handleInlineBlockquoteMutation(inlineBlockquote);
  }
};

const handleReplyItemInnerBodyHeadingMutation = (node: Element, store: TStore, persistor: Persistor) => {
  /* drill down */
  const replyButton = node.querySelector(`.${IconName.Reply}`);
  if (replyButton) {
    handleReplyButtonMutation(replyButton, store, persistor);
  }
};

const handleReplyItemInnerBodyContentMutation = (node: Element) => {
  /* drill down */
  const blockquote = node.querySelector(lihkgSelectors.blockquote);
  if (blockquote) {
    handleBlockquoteMutation(blockquote);
  }
};

const handleReplyButtonMutation = (node: Element, store: TStore, persistor: Persistor) => {
  const user = getUserIDFromNode(node.parentElement!);
  const postId = node.parentElement?.parentElement?.parentElement?.getAttribute(ATTRIBUTES.DATA_POST_ID);
  const post = cache.getReply(postId);
  if (user && post) {
    /* snipe button */
    _handleUnmountableRender(node, snipeButtonRenderCacheSymbol, (node) => {
      const container = createSnipeButtonContainer();
      insertAfter(container, node);
      const root = renderSnipeButton(user, store, persistor, container);
      return { container, root };
    });
    /* add label button */
    _handleUnmountableRender(node, addLabelButtonRenderCacheSymbol, (node) => {
      const container = createAddLabelButtonContainer();
      insertAfter(container, node);
      const root = renderAddLabelButton(user, post, store, persistor, container);
      return { container, root };
    });
    /* source post screenshot button */
    _handleUnmountableRender(node, sourcePostScreenshotButtonRenderCacheSymbol, (node) => {
      const container = createSourcePostScreenshotButtonContainer();
      insertAfter(container, node);
      const root = renderSourcePostScreenshotButton(user, post, store, persistor, container);
      return { container, root };
    });
  }
};

const handleReplyModalMutation = (node: Element, store: TStore, persistor: Persistor) => {
  /* drill down */
  const replyItemInner = node.querySelector(lihkgSelectors.replyItemInner);
  if (replyItemInner) {
    handleReplyItemInnerMutation(replyItemInner, store, persistor);
  }
};

const handleBlockquoteMutation = (node: Element) => {
  const { parentElement } = node;
  /* if it is nested `<blockquote />`, its parent should have been handled before (i.e. mapped post ID), otherwise, get the post ID from the reply item inner element */
  const postId = isBlockquote(parentElement) ? elementPostIdMapping.get(parentElement!) : parentElement?.parentElement?.parentElement?.getAttribute(ATTRIBUTES.DATA_POST_ID);
  const post = cache.getReply(postId);
  _handleBlockquoteMessageInfo(node, post?.quote_post_id, false);
};

const handleInlineBlockquoteMutation = (node: Element) => {
  const inlineBlockquoteBox = node.querySelector(lihkgSelectors.inlineBlockquoteBox)!;
  const postId = node.parentElement?.parentElement?.parentElement?.getAttribute(ATTRIBUTES.DATA_POST_ID);
  const post = cache.getReply(postId);
  _handleBlockquoteMessageInfo(inlineBlockquoteBox, post?.quote_post_id, true);
};

const handleDataPostIdAttributeMutation = (node: Element, store: TStore, persistor: Persistor) => {
  handleReplyItemInnerMutation(node, store, persistor);
};

/**
 * unmount and remove the components
 * @private
 */
const _unmount = (node: Element, symbol: TRenderCacheSymbol) => {
  node[symbol]?.root.unmount();
  node[symbol]?.container.remove();
  delete node[symbol];
  elementPostIdMapping.delete(node);
};

/**
 * unmount and remove the container from the previous mutation, then attach new mutation cache
 * @private
 */
const _handleUnmountableRender: TUnmountableRenderer = (node, symbol, render) => {
  _unmount(node, symbol);
  const cache = render(node);
  node[symbol] = cache;
  return cache;
};

/**
 * render blockquote message info recursively
 * @private
 */
const _handleBlockquoteMessageInfo = (node: Element, postId?: string, inline?: boolean) => {
  const post = cache.getReply(postId);
  if (post) {
    _handleUnmountableRender(node, blockquoteMessageInfoRenderCacheSymbol, (node) => {
      const container = createBlockquoteMessageInfoContainer(inline);
      if (inline) {
        /* inline quote, `node` is inline quote box */
        node.insertAdjacentElement('beforeend', container);
      } else {
        /* normal quote, `node` is `<blockquote />` */
        const unlinkedBlockquote = node.querySelector(`:scope > ${lihkgSelectors.replyItemMessageBody} > ${lihkgSelectors.blockquote}:first-child`);
        if (unlinkedBlockquote) {
          /* there is unlinked nested quote, insert after it */
          insertAfter(container, unlinkedBlockquote);
        } else {
          node.insertBefore(container, node.lastChild);
        }
      }
      const root = renderBlockquoteMessageInfo(post, inline, container);
      elementPostIdMapping.set(node, post.post_id);
      return { container, root };
    });
    const blockquote = node.querySelector(lihkgSelectors.blockquote);
    if (blockquote) {
      /* recursive */
      _handleBlockquoteMessageInfo(blockquote, post.quote_post_id, false);
    }
  }
};

/**
 * mutation handler factory
 */
const createChildListAddedNodeMutationHandler = (node: Element) => {
  debug('createChildListAddedNodeMutationHandler', node);
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
  if (isReplyItemInnerBodyContent(node)) return handleReplyItemInnerBodyContentMutation;
  /** when expand the short reply item */
  if (isReplyButton(node)) return handleReplyButtonMutation;
  /** when render reply modal */
  if (isReplyModal(node)) return handleReplyModalMutation;
  /** when render blockquote */
  if (isBlockquote(node)) return handleBlockquoteMutation;
};

export const handleMutation = (mutation: MutationRecord, store: TStore, persistor: Persistor) => {
  const addedNodes = Array.from(mutation.addedNodes);
  if (isBlockquote(mutation.target as Element)) {
    /* when expand the hidden quotes */
    const [addedNode] = addedNodes;
    const [removedNode] = Array.from(mutation.removedNodes);
    if (isBlockquote(removedNode as Element)) {
      /**
       * the `<blockquote />` of hidden quotes is being removed,
       * unmount the parent and handle it again later (asynchronously)
       * to avoid incorrect layout
       */
      _unmount(mutation.target as Element, blockquoteMessageInfoRenderCacheSymbol);
    }
    if (isBlockquote(addedNode as Element)) {
      /**
       * ***continuing from the above unmount logic***
       * after fetching and rendering the quotes,
       * the expanded `<blockquote />` is being added,
       * handle the parent like normal `childList` mutation
       */
      handleBlockquoteMutation(mutation.target as Element);
    }
  }
  switch (mutation.type) {
    case 'childList': {
      /** generic new nodes handling */
      for (const addedNode of addedNodes) {
        if (addedNode.nodeType === document.ELEMENT_NODE) {
          const handleChildListAddedNodeMutation = createChildListAddedNodeMutationHandler(addedNode as Element);
          if (handleChildListAddedNodeMutation) {
            window.requestAnimationFrame(() => {
              handleChildListAddedNodeMutation(addedNode as Element, store, persistor);
            });
          }
        }
      }
      break;
    }
    case 'attributes': {
      /** when navigate between the quotes */
      if (mutation.attributeName === ATTRIBUTES.DATA_POST_ID) {
        const { target } = mutation;
        window.requestAnimationFrame(() => {
          handleDataPostIdAttributeMutation(target as Element, store, persistor);
        });
      }
      break;
    }
  }
};
