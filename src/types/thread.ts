import { IPost } from './post';
import { Gender, IMe, IUser } from './user';

export interface IThreadListResponseData {
  success: number;
  server_time: number;
  response: IThreadListResponse;
}

interface IThreadListResponse {
  category: ICategory;
  is_pagination: boolean;
  items: IThread[];
  me: IMe;
}

export interface IThread {
  thread_id: string;
  cat_id: string;
  sub_cat_id: string;
  title: string;
  user_id: string;
  user_nickname: string;
  user_gender: Gender;
  no_of_reply: string;
  no_of_uni_user_reply: string;
  like_count: number;
  dislike_count: number;
  reply_like_count: string;
  reply_dislike_count: string;
  max_reply_like_count: string;
  max_reply_dislike_count: string;
  create_time: number;
  last_reply_time: number;
  status: string;
  is_adu: boolean;
  remark: IRemark;
  last_reply_user_id: string;
  max_reply: string;
  total_page: number;
  notice?: string;
  is_hot: boolean;
  category: ICategory;
  display_vote: boolean;
  vote_status: string;
  is_bookmarked: boolean;
  is_replied: boolean;
  user: IUser;
  pinned_post?: IPost;
  sub_category?: ISubCategory;
  is_highlight_sub_cat?: boolean;
}

interface ICategory {
  cat_id: string;
  name: string;
  postable: boolean;
}

interface ISubCategory {
  sub_cat_id: string;
  cat_id: string;
  name: string;
  postable: boolean;
  filterable: boolean;
  is_highlight: boolean;
  orderable: boolean;
  is_filter: boolean;
  url: string;
  query: IQuery;
}

interface IQuery {
  cat_id: string;
  sub_cat_id: string;
}

interface IRemark {
  last_reply_count: number;
  author_pin_post_id?: string;
  no_of_uni_not_push_post: number;
  notice?: string;
  cover_img?: string;
}
