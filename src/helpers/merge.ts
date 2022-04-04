import { produce } from 'immer';
import type { ISerializedDataSet } from '../models/DataSet';
import type { ISerializedSubscription } from './../models/Subscription';
import { isEqual as isLabelEqual } from './label';
import { isEqual as isSubscriptionEqual } from './subscription';

export enum MergeDirection {
  IncomingToLocal,
  LocalToIncoming
}

/**
 * merge the data sets
 * @template {ISerializedDataSet} T
 * @param {T} dataSetA the target data set
 * @param {T} dataSetB the incoming data set
 * @param {boolean} prune prune the labels from dataSetA if it does not exist in dataSetB
 * @returns {T}
 */
export const mergeDataSet = <T extends ISerializedDataSet> (dataSetA: T, dataSetB: T, prune: boolean): T => {
  return produce(dataSetA, (dataSetA) => {
    const { data: dataA } = dataSetA;
    const { data: dataB } = dataSetB;
    const usersA = Object.keys(dataA);
    const usersB = Object.keys(dataB);
    for (const userA of usersA) {
      const labelsB = dataB[userA];
      /** existing user in B */
      if (labelsB) {
        if (prune) {
          /** prune the missing B in A */
          dataA[userA] = dataA[userA]?.filter((labelA) => {
            const labelB = labelsB.find((labelB) => isLabelEqual(labelA, labelB));
            return !!labelB;
          });
        }
        /** merge B into A */
        const labelsA = dataA[userA]!;
        for (const labelB of labelsB) {
          const labelA = labelsA.find((labelA) => isLabelEqual(labelA, labelB, true));
          if (labelA) {
            /** existing label */
            labelA.text = labelB.text;
            labelA.reason = labelB.reason;
            labelA.url = labelB.url;
            labelA.date = labelB.date;
            labelA.source = labelB.source;
            labelA.color = labelB.color;
            labelA.image = labelB.image;
          } else {
            /** new label */
            labelsA.push(labelB);
          }
        }
      } else {
        if (prune) {
          delete dataA[userA];
        }
      }
    }
    for (const userB of usersB) {
      /** new users */
      if (!(userB in dataA)) {
        dataA[userB] = dataB[userB];
      }
    }
  });
};

/**
 * merge the subscriptions arrays
 * @param {ISerializedSubscription[]} subscriptionsA the target subscriptions array
 * @param {ISerializedSubscription[]} subscriptionsB the incoming subscriptions array
 * @param {boolean} prune prune the subscription from subscriptionsA if it does not exist in subscriptionsB
 * @returns {ISerializedSubscription[]}
 */
export const mergeSubscriptions = (subscriptionsA: ISerializedSubscription[], subscriptionsB: ISerializedSubscription[], prune: boolean): ISerializedSubscription[] => {
  /** prune the missing B in A */
  const _subscriptionsA = !prune ? subscriptionsA : subscriptionsA.filter((subscriptionA) => {
    const subscriptionB = subscriptionsB.find((subscriptionB) => isSubscriptionEqual(subscriptionA, subscriptionB));
    return !!subscriptionB;
  });
  return produce(_subscriptionsA, (subscriptionsA) => {
    /** existing subscriptions */
    for (const subscriptionA of subscriptionsA) {
      const subscriptionB = subscriptionsB.find((subscriptionB) => isSubscriptionEqual(subscriptionA, subscriptionB));
      if (subscriptionB) {
        subscriptionA.name = subscriptionB.name;
        subscriptionA.enabled = subscriptionB.enabled;
      }
    }
    /** new subscriptions */
    for (const subscriptionB of subscriptionsB) {
      const subscriptionA = subscriptionsA.find((subscriptionA) => isSubscriptionEqual(subscriptionA, subscriptionB));
      if (!subscriptionA) {
        subscriptionsA.push(subscriptionB);
      }
    }
  });
};
