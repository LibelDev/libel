import produce from 'immer';
import { createSelector } from 'reselect';
import Data from '../models/Data';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import { TRootState } from './store';

export const selectConfig = (state: TRootState) => state.config;

export const selectMeta = (state: TRootState) => state.meta;

export const selectSync = (state: TRootState) => state.sync;

export const selectPersonal = (state: TRootState) => state.personal;

export const selectSubscriptions = (state: TRootState) => state.subscriptions;

export const filterPersonalForUser = (user: string) => createSelector(
  selectPersonal,
  createDataSetUserFilter(user)
);

export const filterSubscriptionsForUser = (user: string) => createSelector(
  selectSubscriptions,
  (subscriptions) => (
    subscriptions
      .filter((subscription) => subscription.enabled && subscription.loaded)
      .map(createDataSetUserFilter(user))
  )
);

export const flatMapSubscriptionsToLabels = (subscriptions: Subscription[]) => {
  return subscriptions
    .map((subscription) => subscription.aggregate())
    .flatMap(({ labels }) => labels);
};

export const createDataSetUserFilter = <T extends Personal | Subscription> (user: string) => (dataSet: T) => (
  produce(dataSet, (dataSet) => {
    dataSet.data = new Data({
      [user]: dataSet.data[user]
    });
  })
);
