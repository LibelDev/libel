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

enum Gender {
  F = 'F',
  M = 'M',
}

enum LevelName {
  新手會員 = '新手會員',
  普通會員 = '普通會員',
  站長 = '站長',
}

export interface IUser {
  user_id: string;
  nickname: string;
  level: string;
  gender: Gender;
  status: string;
  create_time: number;
  level_name: LevelName;
  is_following: boolean;
  is_blocked: boolean;
  is_disappear: boolean;
  is_newbie: boolean;
}

interface IMe extends IUser {
  email: string;
  plus_expiry_time: number;
  last_login_time: number;
  is_disappear: boolean;
  is_plus_user: boolean;
  meta_data: IMetaData;
}

interface IMetaData {
  custom_cat: unknown[];
  keyword_filter: string;
  login_count: number;
  last_read_notify_time: number;
  notify_count: number;
  push_setting: IPushSetting;
  twofa_setting: I2FASetting;
  auto_logout: IAutoLogout;
}

interface IAutoLogout {
  enabled: boolean;
}

interface IPushSetting {
  all: boolean;
  show_preview: boolean;
  new_reply: boolean;
  quote: boolean;
  following_new_thread: boolean;
}

interface I2FASetting {
  totp: boolean;
}

export interface IDraft {
  tid: string;
  title: string;
  channel: string;
  content: string;
  isReply: boolean;
}
