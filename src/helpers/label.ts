import { IPost } from '../types/lihkg';
import { ILabel, ISource } from './../models/Label';
import { TTracablePost } from './../types/lihkg';
import { counter } from './counter';

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
