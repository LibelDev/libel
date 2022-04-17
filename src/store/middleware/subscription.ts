import type { Middleware } from '@reduxjs/toolkit';
import debugFactory from 'debug';
import { render } from 'mustache';
import * as LIHKG from '../../helpers/lihkg';
import { notification } from '../../templates/subscription';
import { actions as subscriptionsActions } from '../slices/subscriptions';
import type { TRootState } from '../store';

type RejectedSubscriptionLoadAction = ReturnType<typeof subscriptionsActions.load['rejected']>;

const debug = debugFactory('libel:store:middleware:subscription');

export const createLoadSubscriptionRejectedNotifier = (): Middleware<{}, TRootState> => (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === subscriptionsActions.load.rejected.type) {
    debug('createLoadSubscriptionRejectedNotifier:action', action, result);
    const { payload, error, meta } = action as RejectedSubscriptionLoadAction;
    const message = payload || error.message;
    const { subscription } = meta;
    const body = render(notification.body, { subscription, message });
    const _notification = LIHKG.createLocalNotification(body, 5000);
    LIHKG.showNotification(_notification);
  }
  return result;
};
