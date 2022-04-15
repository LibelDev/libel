import React from 'react';
import type { Persistor } from 'redux-persist';
import { fetchAnnouncements } from '../apis/announcement';
import Announcement from '../components/Announcement/Announcement';
import NewVersionAnnouncement from '../components/NewVersionAnnouncement/NewVersionAnnouncement';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import { hasRead } from '../helpers/announecement';
import { addedNodeMutationHandlerFactory, handleDataPostIdAttributeMutation, renderAnnouncement } from '../helpers/mutation';
import { checkUpdate } from '../helpers/version';
import { intercept } from '../helpers/xhr';
import type { TStore } from '../store/store';
import type { IQuoteListResponseData, IReplyListResponseData, IThreadListResponseData } from '../types/lihkg';
import type Cache from './Cache';

class App {
  private cache: Cache;
  private store: TStore;
  private persistor: Persistor;

  constructor (cache: Cache, store: TStore, persistor: Persistor) {
    this.cache = cache;
    this.store = store;
    this.persistor = persistor;
  }

  async start () {
    this.bootstrap();
    this.bindEvents();
    await this.checkUpdate();
    await this.checkAnnouncements();
    return this;
  }

  private bindEvents () {
    this.bindRequestInterceptor();
  }

  /**
   * bootstrap the app
   * @private
   */
  private bootstrap () {
    const { store, persistor } = this;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        switch (mutation.type) {
          case 'childList': {
            /** generic new nodes handling */
            const nodes = Array.from(mutation.addedNodes);
            for (const node of nodes) {
              if (node.nodeType === document.ELEMENT_NODE) {
                const handle = addedNodeMutationHandlerFactory(node as Element);
                if (handle) {
                  window.requestAnimationFrame(() => {
                    handle(node as Element, store, persistor);
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
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [ATTRIBUTES.DATA_POST_ID]
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
        const { id, icon, body, endAt, forced } = announcement;
        if ((!id || !hasRead(id)) && (!endAt || now <= endAt)) {
          renderAnnouncement(
            <Announcement id={id} icon={icon} forced={forced}>
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
        renderAnnouncement(
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
