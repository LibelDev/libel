import type { IconName } from '../components/Icon/types';

export interface IAnnouncement {
  /** @since 1.0.18 */
  id?: string;
  icon?: IconName;
  body: string;
  endAt?: number;
  forced?: boolean;
}
