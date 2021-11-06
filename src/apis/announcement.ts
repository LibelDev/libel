import { publicDataURL } from './../../config/config';
import { IAnnouncement } from './../types/announcement';

export const fetchAnnouncements = async () => {
  const url = `${publicDataURL}/announcements.json`;
  const response = await fetch(url);
  const json = await response.json();
  return json as IAnnouncement[];
};
