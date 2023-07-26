import { APP_DATA } from './constants/files';
import { SYNC_INTERVAL } from './constants/sync';
import * as TEXTS from './constants/texts';
import * as gtag from './helpers/gtag';
import * as LIHKG from './helpers/lihkg';
import Cloud, { SyncEvent } from './models/Cloud';
import store from './store/store';
import { EventAction, EventCategory } from './types/ga';

const cloud = new Cloud(store, APP_DATA, SYNC_INTERVAL);

cloud.on(SyncEvent.Sync, () => {
  const notificationSyncInProgress = LIHKG.createLocalNotification(TEXTS.CLOUD_SYNC_MESSAGE_SYNC_IN_PROGRESS, 0);
  LIHKG.showNotification(notificationSyncInProgress);
  cloud.once(SyncEvent.Finish, () => {
    LIHKG.removeNotification(notificationSyncInProgress.id);
  });
});

cloud.on(SyncEvent.Success, () => {
  const notificationSyncSuccess = LIHKG.createLocalNotification(TEXTS.CLOUD_SYNC_MESSAGE_SYNC_SUCCESS);
  LIHKG.showNotification(notificationSyncSuccess);
});

cloud.on(SyncEvent.Error, () => {
  const notificationSyncFailed = LIHKG.createLocalNotification(TEXTS.CLOUD_SYNC_MESSAGE_SYNC_FAILED);
  LIHKG.showNotification(notificationSyncFailed);
});

cloud.once(SyncEvent.Finish, () => {
  // analytics
  gtag.event(EventAction.CloudSync, { event_category: EventCategory.Google });
});

export default cloud;
