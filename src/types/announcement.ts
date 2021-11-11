import { IconName } from './icon';

export interface IAnnouncement {
  id?: string; // added in 1.0.18
  icon?: IconName;
  body: string;
  endAt?: number;
}
