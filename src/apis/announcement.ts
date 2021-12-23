import { publicDataURL } from '../../config/config';
import { IconName } from '../types/icon';

interface IAnnouncement {
  id?: string; // added in 1.0.18
  icon?: IconName;
  body: string;
  endAt?: number;
  forced?: boolean;
}

export const fetchAnnouncements = async () => {
  const url = `${publicDataURL}/announcements.json`;
  const response = await fetch(url);
  const json = await response.json();
  return json as IAnnouncement[];
};
