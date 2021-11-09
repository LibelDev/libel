import { IconName } from './icon';

export interface IAnnouncement {
  icon?: IconName;
  body: string;
  endAt?: number;
}
