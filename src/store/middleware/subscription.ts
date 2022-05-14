import type { Middleware } from '@reduxjs/toolkit';
import debugFactory from 'debug';
import { render } from 'mustache';
import * as LIHKG from '../../helpers/lihkg';
import { notification } from '../../templates/subscription';
import { selectSubscriptions } from '../selectors';
import { actions as subscriptionsActions } from '../slices/subscriptions';
import type { TRootState, TStore } from '../store';

type TToggleAction = ReturnType<typeof subscriptionsActions.toggle>;

type TRejectedSubscriptionLoadAction = ReturnType<typeof subscriptionsActions.load['rejected']>;

const debug = debugFactory('libel:store:middleware:subscription');

export const createLoadSubscriptionOnEnableListener = (): Middleware<{}, TRootState> => (store) => (next) => (action) => {
  const { dispatch, getState } = store as TStore;
  const result = next(action);
  if (action.type === subscriptionsActions.toggle.type) {
    debug('createLoadSubscriptionOnEnableListener:action', action, result);
    const state = getState();
    const subscriptions = selectSubscriptions(state);
    const { payload } = action as TToggleAction;
    const { index } = payload;
    const subscription = subscriptions[index];
    const { enabled, loading, loaded } = subscription;
    if (enabled && !loading && !loaded) {
      dispatch(subscriptionsActions.load(index));
    }
  }
  return result;
};

export const createLoadSubscriptionRejectedNotifier = (): Middleware<{}, TRootState> => (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === subscriptionsActions.load.rejected.type) {
    debug('createLoadSubscriptionRejectedNotifier:action', action, result);
    const { payload, error, meta } = action as TRejectedSubscriptionLoadAction;
    const message = payload || error.message;
    const { subscription } = meta;
    const body = render(notification.body, { subscription, message });
    const _notification = LIHKG.createLocalNotification(body);
    LIHKG.showNotification(_notification);
  }
  return result;
};
