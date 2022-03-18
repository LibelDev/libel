import { shortenedHost } from '../constants/lihkg';
import { IPost } from '../types/lihkg';
import { ILabel, ISource } from './../models/Label';
import { TTracablePost } from './../types/lihkg';
import { counter } from './counter';
import { getShareID } from './lihkg';

export const mapPostToSource = (post: IPost): ISource => {
  return {
    thread: post.thread_id,
    page: post.page,
    messageNumber: post.msg_num
  };
};

export const mapSourceToPost = (source: ISource): TTracablePost => {
  return {
    thread_id: source.thread,
    page: source.page,
    msg_num: source.messageNumber
  };
};

export const getAvailableLabelID = (labels: ILabel[]) => {
  const count = counter(1);
  while (true) {
    const { value } = count.next();
    const id = `${value}`;
    const label = labels.find((label) => label.id === id);
    if (!label) {
      return id;
    }
  }
};

export const getShareURL = (label: ILabel) => {
  const { source } = label;
  if (source) {
    const post = mapSourceToPost(source);
    const shareID = getShareID(post);
    return `${shortenedHost}/${shareID}`;
  }
  // fallback to the deprecated url
  return label.url;
};
