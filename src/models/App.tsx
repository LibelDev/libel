import React from 'react';
import { Store } from 'redux';
import { fetchAnnouncements } from '../apis/announcement';
import Announcement from '../components/Announcement/Announcement';
import NewVersionAnnouncement from '../components/NewVersionAnnouncement/NewVersionAnnouncement';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import * as LIHKG from '../helpers/lihkg';
import { checkUpdate } from '../helpers/version';
import { intercept } from '../helpers/xhr';
import { IQuoteListResponseData, IReplyListResponseData } from '../types/post';
import { IThreadListResponseData } from '../types/thread';
import Cache from './Cache';

class App {
  private cache!: Cache;
  private store!: Store;

  constructor (cache: Cache, store: Store) {
    this.cache = cache;
    this.store = store;
  }

  async start () {
    this.bootstrap();
    this.bindEvents();
    await this.checkUpdate();
    await this.checkAnnouncements();
    return this;
  }

  private bindEvents () {
    this.bindCurrentReplyCacher();
    this.bindRequestInterceptor();
  }

  /**
   * bootstrap the app
   * @private
   */
  private bootstrap () {
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
  }

  /**
   * cache the target reply
   * @private
   */
  private bindCurrentReplyCacher () {
    const { cache } = this;
    document.addEventListener('click', (event) => {
      try {
        const { parentElement } = event.target as Element;
        if (parentElement && LIHKG.isNickname(parentElement)) {
          const { parentElement: replyElement } = parentElement.parentElement!.parentElement!;
          cache.targetReply = replyElement;
        }
      } catch (err) {
        console.error(err);
        cache.targetReply = null;
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

  private async checkAnnouncements () {
    try {
      const announcements = await fetchAnnouncements();
      const now = Date.now();
      for (const announcement of announcements) {
        const { icon, body, endAt } = announcement;
        if (now <= endAt) {
          LIHKG.renderAnnouncement(
            <Announcement icon={icon}>
              <span dangerouslySetInnerHTML={{ __html: body }} />
            </Announcement>
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async checkUpdate () {
    try {
      const [available, currentVersion, newVersion, latestRelease] = await checkUpdate();
      if (available) {
        LIHKG.renderAnnouncement(
          <NewVersionAnnouncement
            currentVersion={currentVersion}
            newVersion={newVersion!}
            release={latestRelease!}
          />
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default App;
