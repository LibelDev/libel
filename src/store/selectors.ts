import produce from 'immer';
import { createSelector } from 'reselect';
import Data from '../models/Data';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import type { TRootState } from './store';

export const selectConfig = (state: TRootState) => state.config;

export const selectMeta = (state: TRootState) => state.meta;

export const selectSync = (state: TRootState) => state.sync;

export const selectPersonal = (state: TRootState) => state.personal;

export const selectSubscriptions = (state: TRootState) => state.subscriptions;

export const createUserPersonalSelector = (user: string) => createSelector(
  selectPersonal,
  createDataSetUserFilter(user)
);

export const createUserSubscriptionsSelector = (user: string) => createSelector(
  selectSubscriptions,
  (subscriptions) => (
    subscriptions
      .filter((subscription) => subscription.enabled && subscription.loaded)
      .map(createDataSetUserFilter(user))
  )
);

export const createUserPersonalLabelsSelector = (user: string) => createSelector(
  createUserPersonalSelector(user),
  (personal) => {
    const { labels } = personal.aggregate();
    return labels;
  }
);

export const createUserSubscriptionLabelsSelector = (user: string) => createSelector(
  createUserSubscriptionsSelector(user),
  (subscriptions) => subscriptions
    .map((subscription) => subscription.aggregate())
    .flatMap(({ labels }) => labels)
);

export const createUserLabelsSelector = (user: string) => createSelector(
  createUserPersonalLabelsSelector(user),
  createUserSubscriptionLabelsSelector(user),
  (personalLabels, subscriptionsLabels) => (
    [...personalLabels, ...subscriptionsLabels]
  )
);

export const createDataSetUserFilter = <T extends Personal | Subscription> (user: string) => (dataSet: T) => (
  produce(dataSet, (dataSet) => {
    dataSet.data = new Data({
      [user]: dataSet.data[user]
    });
  })
);
