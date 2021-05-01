import { IThread } from './thread';
import { IUser, IMe, Gender } from './user';

export interface IQuoteListResponseData {
  success: number;
  server_time: number;
  response: IQuoteListResponse;
}

interface IQuoteListResponse {
  page: string;
  item_data: IPost[];
  thread: IThread;
  parent_post: IPost;
  me: IMe;
}

export interface IReplyListResponseData {
  success: number;
  server_time: number;
  response: IReplyListResponse;
}

interface IReplyListResponse extends IThread {
  page: string;
  item_data: IPost[];
  me: IMe;
}

export interface IPost {
  post_id: string;
  quote_post_id: string;
  thread_id: string;
  user_nickname: string;
  user_gender: Gender;
  like_count: string;
  dislike_count: string;
  vote_score: string;
  no_of_quote: string;
  remark: unknown[] | IRemark;
  status: string;
  reply_time: number;
  msg_num: string;
  msg: string;
  is_minimized_keywords: boolean;
  page: number;
  user: IUser;
  vote_status: string;
  display_vote: boolean;
  low_quality: boolean;
  quote?: IPost;
}

interface IRemark {
  is_newbie?: boolean;
  is_not_push_post?: boolean;
}
