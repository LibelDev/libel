import { File, publicDataURL as baseURL } from '../../config/config';
import { IAnnouncement } from '../types/app';

export const fetchAnnouncements = async () => {
  const url = `${baseURL}/${File.Announcements}`;
  const response = await fetch(url);
  const json = await response.json();
  return json as IAnnouncement[];
};
