import cache from '../cache';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import * as LIHKG from '../helpers/lihkg';
import { intercept } from '../helpers/xhr';
import storage from '../storage';
import store from '../store/store';
import { IQuoteListResponseData, IReplyListResponseData } from '../types/post';
import { IThreadListResponseData } from '../types/thread';

class App {
  private cache = cache;
  private storage = storage;
  private store = store;

  async start () {
    const { storage } = this;
    await storage.ready();
    this.bindEvents();
    this.bootstrap();
    return this;
  }

  private bindEvents () {
    this.bindCurrentReplyCacher();
    this.bindRequestInterceptor();
  }

  /**
   * bootstrap the app
   * @returns {this}
   */
  private bootstrap (): this {
    const { store } = this;

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
                    const nodes = LIHKG.querySelectorNickname(node);
                    LIHKG.handleNicknames(nodes, store);
                  }
                }
              }
              break;
            }
            case 'attributes': {
              if (mutation.attributeName === ATTRIBUTES.dataPostId) {
                const { target } = mutation;
                const nodes = LIHKG.querySelectorNickname(target);
                LIHKG.handleNicknames(nodes, store);
              }
              break;
            }
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

    return this;
  }

  /**
   * cache the current clicked reply
   * @private
   */
  private bindCurrentReplyCacher () {
    const { cache } = this;
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
  }

  /**
   * intercept the network requests to cache the API responses
   * @private
   */
  private bindRequestInterceptor () {
    const { cache } = this;
    intercept('load', function () {
      const { responseURL } = this;
      const isThreadList = REGEXES.THREAD_LIST_API.test(responseURL);
      const isQuoteList = REGEXES.QUOTE_LIST_API.test(responseURL);
      const isReplyList = REGEXES.REPLY_LIST_API.test(responseURL);
      if (isThreadList || isQuoteList || isReplyList) {
        const data = JSON.parse(this.responseText) as IThreadListResponseData | IQuoteListResponseData | IReplyListResponseData;
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
  }
}

export default App;
