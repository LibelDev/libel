import produce from 'immer';
import { createSelector } from 'reselect';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import { TRootState } from './store';

export const selectPersonal = (state: TRootState) => state.personal as Personal;

export const selectSubscriptions = (state: TRootState) => state.subscriptions as Subscription[];

export const filterPersonal = (user: string) => createSelector(
  selectPersonal,
  (personal) => filterDataSetForUser(personal, user)
);

export const filterSubscriptions = (user: string) => createSelector(
  selectSubscriptions,
  (subscriptions) => (
    filterEnabledSubscriptions(subscriptions)
      .map((subscription) => filterDataSetForUser(subscription, user))
  )
);

const filterEnabledSubscriptions = (subscriptions: Subscription[]) => (
  subscriptions.filter((subscription) => subscription.enabled)
);

export const filterDataSetForUser = <T extends Personal | Subscription> (dataSet: T, user: string) => (
  produce(dataSet, (dataSet) => {
    dataSet.data = {
      [user]: dataSet.data[user]
    };
  })
);
