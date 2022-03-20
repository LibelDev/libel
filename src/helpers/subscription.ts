import { SUBSCRIPTION_MESSAGE_QUESTION_ADD } from '../constants/texts';
import type { ISerializedSubscription } from '../models/Subscription';

export const prompt = () => {
  const url = window.prompt(SUBSCRIPTION_MESSAGE_QUESTION_ADD);
  return url;
};

export const isEqual = (subscriptionA: ISerializedSubscription, subscriptionB: ISerializedSubscription) => {
  return subscriptionA.url === subscriptionB.url;
};
