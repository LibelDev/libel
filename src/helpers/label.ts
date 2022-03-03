import { IPost } from '../types/lihkg';
import { ISource } from './../models/Label';
import { TTracablePost } from './../types/lihkg';

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
