import cache from './cache';
import * as ATTRIBUTES from './constants/attributes';
import * as REGEXES from './constants/regexes';
import { intercept } from './helpers/xhr';
import * as LIHKG from './helpers/lihkg';
import storage from './storage';
import store, { loadStorageIntoStore, createStorageListener } from './store/store';
import { IQuoteListResponseData, IReplyListResponseData } from './types/post';
import { IThreadListResponseData } from './types/thread';
import './stylesheets/main.scss';
import './stylesheets/lihkg.scss';

// cache the reply from the clicked username
document.addEventListener('click', (event) => {
  try {
    const { parentElement } = event.target as Element;
    if (parentElement && LIHKG.isNickname(parentElement)) {
      const { parentElement: replyElement } = parentElement.parentElement!.parentElement!;
      const postID = replyElement!.getAttribute(ATTRIBUTES.dataPostId)!;
      cache.currentReply = cache.getReply(postID);
    }
  } catch (err) {
    console.error(err);
    cache.currentReply = undefined;
  }
});

intercept('load', function () {
  const isThreadList = REGEXES.THREAD_LIST_API.test(this.responseURL);
  const isQuoteList = REGEXES.QUOTE_LIST_API.test(this.responseURL);
  const isReplyList = REGEXES.REPLY_LIST_API.test(this.responseURL);
  if (isThreadList || isQuoteList || isReplyList) {
    const data = JSON.parse(this.responseText);
    if (data.success === 1) {
      if (isThreadList) {
        cache.addThreads(data as IThreadListResponseData);
      }
      if (isQuoteList || isReplyList) {
        cache.addReplies(data as IQuoteListResponseData | IReplyListResponseData);
      }
      cache.addUsers(data as IThreadListResponseData & IQuoteListResponseData & IReplyListResponseData);
    }
  }
});

// sync store between browser tabs
window.addEventListener('storage', createStorageListener());

async function main () {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      window.requestAnimationFrame(() => {
        switch (mutation.type) {
          case 'childList': {
            const nodes = Array.from(mutation.addedNodes);
            for (const node of nodes) {
              if (node.nodeType === document.ELEMENT_NODE) {
                if (LIHKG.isThread(node)) {
                  LIHKG.handleThread(node, store);
                } else if (LIHKG.isUserCardModal(node)) {
                  LIHKG.handleUserCardModal(node, store);
                } else if (LIHKG.isSettingsModal(node)) {
                  LIHKG.handleSettingsModal(node, store);
                } else {
                  const nicknames = Array.from(LIHKG.querySelectorNickname(node));
                  for (const node of nicknames) {
                    LIHKG.handleNickname(node, store);
                  }
                }
              }
            }
            break;
          }
          // case 'attributes': {
          //   if (mutation.attributeName === ATTRIBUTES.dataPostId) {
          //     const { target } = mutation;
          //     const nickname = target.querySelector(SELECTORS.nickname);
          //     unrenderNickname(nickname);
          //     renderNickname(nickname);
          //   }
          //   break;
          // }
        }
      });
    }
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [ATTRIBUTES.dataPostId]
  });
}

loadStorageIntoStore(storage);
main();
