import { IconName } from '../components/Icon/Icon';
import { publicDataURL } from './../../config/config';

interface IAnnouncement {
  icon?: IconName;
  body: string;
  endAt: number;
}

export const fetchAnnouncements = async () => {
  const url = `${publicDataURL}/announcements.json`;
  const response = await fetch(url);
  const json = await response.json();
  return json as IAnnouncement[];
};
