export enum Gender {
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

export interface IMe extends IUser {
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
