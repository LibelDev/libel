import produce from 'immer';
import { createSelector } from 'reselect';
import Data from '../models/Data';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import { TRootState } from './store';

export const selectMeta = (state: TRootState) => state.meta;

export const selectSync = (state: TRootState) => state.sync;

export const selectPersonal = (state: TRootState) => state.personal;

export const selectSubscriptions = (state: TRootState) => state.subscriptions;

export const filterPersonalForUser = (user: string) => createSelector(
  selectPersonal,
  (personal) => filterDataSetForUser(personal as Personal, user)
);

export const filterSubscriptionsForUser = (user: string) => createSelector(
  selectSubscriptions,
  (subscriptions) => (
    subscriptions
      .filter((subscription) => subscription.enabled && subscription.loaded)
      .map((subscription) => filterDataSetForUser(subscription as Subscription, user))
  )
);

export const filterDataSetForUser = <T extends Personal | Subscription> (dataSet: T, user: string) => (
  produce(dataSet, (dataSet) => {
    dataSet.data = new Data({
      [user]: dataSet.data[user]
    });
  })
);
