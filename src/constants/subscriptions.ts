import { dev } from '../../config/config';
import { ISerializedSubscription } from '../models/Subscription';

export const defaultSubscriptions: ISerializedSubscription[] = !dev ? [] : [
  {
    url: 'http://localhost:20630/mock/subscriptions/sample1.json',
    enabled: true,
    name: 'Sample 1'
  },
  {
    url: 'http://localhost:20630/mock/subscriptions/sample2.json',
    enabled: true,
    name: 'Sample 2'
  },
  {
    url: 'http://localhost:20630/mock/subscriptions/sample3.json',
    enabled: false,
    name: 'Sample 3'
  }
];
