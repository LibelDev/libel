import { produce } from 'immer';
import defaultTo from 'lodash/defaultTo';
import { IData } from '../models/Data';
import Personal, { ISerializedPersonal } from './../models/Personal';
import Subscription, { ISerializedSubscription } from './../models/Subscription';

export enum MergeDirection {
  IncomingToLocal,
  LocalToIncoming
}

const mergeData = (data: IData, incomingData: IData, mergeDirection: MergeDirection) => {
  const users = Object.keys(data);
  const incomingUsers = Object.keys(incomingData);
  return produce(data, (data) => {
    // existing users
    for (const user of users) {
      const incomingLabels = incomingData[user] || [];
      for (const incomingLabel of incomingLabels) {
        const label = data[user]!.find((label) => label.text === incomingLabel.text);
        if (label) {
          // label with the same text already exists
          switch (mergeDirection) {
            case MergeDirection.IncomingToLocal: {
              label.reason = defaultTo(incomingLabel.reason, label.reason);
              label.url = defaultTo(incomingLabel.url, label.url);
              label.date = defaultTo(incomingLabel.date, label.date);
              label.source = defaultTo(incomingLabel.source, label.source);
              label.color = defaultTo(incomingLabel.color, label.color);
              label.image = defaultTo(incomingLabel.image, label.image);
              break;
            }
            case MergeDirection.LocalToIncoming: {
              label.reason = defaultTo(label.reason, incomingLabel.reason);
              label.url = defaultTo(label.url, incomingLabel.url);
              label.date = defaultTo(label.date, incomingLabel.date);
              label.source = defaultTo(label.source, incomingLabel.source);
              label.color = defaultTo(label.color, incomingLabel.color);
              label.image = defaultTo(label.image, incomingLabel.image);
              break;
            }
          }
        } else {
          if (mergeDirection === MergeDirection.IncomingToLocal) {
            data[user]!.push(incomingLabel);
          }
        }
      }
    }
    if (mergeDirection === MergeDirection.IncomingToLocal) {
      // new users
      for (const incomingUser of incomingUsers) {
        if (!(incomingUser in data)) {
          data[incomingUser] = incomingData[incomingUser];
        }
      }
    }
  });
};

export const mergePersonal = (personal: Personal | ISerializedPersonal, incomingPersonal?: ISerializedPersonal, mergeDirection = MergeDirection.IncomingToLocal) => {
  if (incomingPersonal) {
    const data = mergeData(personal.data, incomingPersonal.data, mergeDirection);
    return { data } as ISerializedPersonal;
  }
  return personal;
};

export const mergeSubscriptions = (subscriptions: (Subscription | ISerializedSubscription)[], incomingSubscriptions?: ISerializedSubscription[], mergeDirection = MergeDirection.IncomingToLocal) => {
  if (incomingSubscriptions) {
    return produce(subscriptions, (subscriptions) => {
      // existing subscriptions
      for (const subscription of subscriptions) {
        const incomingSubscription = incomingSubscriptions.find(({ url }) => url === subscription.url);
        if (incomingSubscription) {
          switch (mergeDirection) {
            case MergeDirection.IncomingToLocal: {
              subscription.name = defaultTo(incomingSubscription.name, subscription.name);
              subscription.enabled = defaultTo(incomingSubscription.enabled, subscription.enabled);
              break;
            }
            case MergeDirection.LocalToIncoming: {
              subscription.name = defaultTo(subscription.name, incomingSubscription.name);
              subscription.enabled = defaultTo(subscription.enabled, incomingSubscription.enabled);
              break;
            }
          }
        }
      }
      if (mergeDirection === MergeDirection.IncomingToLocal) {
        // new subscriptions
        for (const incomingSubscription of incomingSubscriptions) {
          const subscription = subscriptions.find(({ url }) => url === incomingSubscription.url);
          if (!subscription) {
            subscriptions.push(incomingSubscription);
          }
        }
      }
    });
  }
  return subscriptions;
};
