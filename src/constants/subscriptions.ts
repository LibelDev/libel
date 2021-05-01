import * as env from '../helpers/env';
import { ISerializedSubscription } from '../models/Subscription';

export const defaultSubscriptions: ISerializedSubscription[] = !env ? [] : [
  {
    url: 'http://localhost:20630/subscriptions/sample1.json',
    enabled: true,
    name: 'Sample 1'
  },
  {
    url: 'http://localhost:20630/subscriptions/sample2.json',
    enabled: true,
    name: 'Sample 2'
  },
  {
    url: 'http://localhost:20630/subscriptions/sample3.json',
    enabled: false,
    name: 'Sample 3'
  }
];
