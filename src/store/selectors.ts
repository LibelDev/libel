import { original, produce } from 'immer';
import { createSelector } from 'reselect';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import { RootState } from './store';

export const selectPersonal = (state: RootState) => state.personal as Personal;

export const selectSubscriptions = (state: RootState) => state.subscriptions as Subscription[];

export const filterPersonal = (user: string) => createSelector(
  selectPersonal,
  (personal) => filterDataSets(personal, user)
);

export const filterSubscriptions = (user: string) => createSelector(
  selectSubscriptions,
  (subscriptions) => (
    subscriptions
      .filter((subscription) => subscription.enabled)
      .map((subscription) => filterDataSets(subscription, user))
  )
);

const filterDataSets = <T extends Personal | Subscription> (dataSet: T, user: string) => (
  produce(dataSet, (dataSet) => {
    dataSet.data = {
      [user]: dataSet.data[user]
    };
  })
);

// const filterDataSets = <T extends Personal | Subscription> (dataSet: T, user: string) => dataSet;
