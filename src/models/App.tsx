import type { Persistor } from 'redux-persist';
import { fetchAnnouncements } from '../apis/app';
import Announcement from '../components/Announcement/Announcement';
import NewVersionAnnouncement from '../components/NewVersionAnnouncement/NewVersionAnnouncement';
import * as ATTRIBUTES from '../constants/attributes';
import * as REGEXES from '../constants/regexes';
import { hasRead } from '../helpers/announecement';
import { createAddedNodeMutationHandler, handleDataPostIdAttributeMutation, renderAnnouncement } from '../helpers/mutation';
import { checkUpdate } from '../helpers/version';
import { intercept } from '../helpers/xhr';
import type { TStore } from '../store/store';
import type { APIv2 } from '../types/lihkg';
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

  async bootstrap () {
    this.observe();
    this.bindEvents();
    await this.checkUpdate();
    await this.checkAnnouncements();
    return this;
  }

  private bindEvents () {
    this.bindRequestInterceptor();
  }

  /**
   * observer mutations
   * @private
   */
  private observe () {
    const { store, persistor } = this;

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        switch (mutation.type) {
          case 'childList': {
            /** generic new nodes handling */
            const nodes = Array.from(mutation.addedNodes);
            for (const node of nodes) {
              if (node.nodeType === document.ELEMENT_NODE) {
                const handleMutation = createAddedNodeMutationHandler(node as Element);
                if (handleMutation) {
                  window.requestAnimationFrame(() => {
                    handleMutation(node as Element, store, persistor);
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
        const data = JSON.parse(this.responseText) as APIv2.IThreadListResponseBody | APIv2.IQuoteListResponseBody | APIv2.IReplyListResponseBody;
        if (data.success === 1) {
          if (isThreadList) {
            cache.addThreads(data as APIv2.IThreadListResponseBody);
          }
          if (isQuoteList || isReplyList) {
            cache.addReplies(data as APIv2.IQuoteListResponseBody | APIv2.IReplyListResponseBody);
          }
          cache.addUsers(data as APIv2.IThreadListResponseBody & APIv2.IQuoteListResponseBody & APIv2.IReplyListResponseBody);
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
