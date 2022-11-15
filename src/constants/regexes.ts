export const PROFILE_URL = /^\/profile\/(\d+)$/;
export const THREAD_URL = /\/thread\/(\d+)/;
export const THREAD_LIST_API = /^https:\/\/lihkg\.com\/api_v2\/(thread(\?thread_ids|\/(hot|latest|custom|bookmark|category|following))|user\/\d+\/thread)/;
export const QUOTE_LIST_API = /^https:\/\/lihkg\.com\/api_v2\/thread\/(\d+)\/[a-f0-9]+\/quotes\/page\/\d+/;
export const REPLY_LIST_API = /^https:\/\/lihkg\.com\/api_v2\/thread\/\d+\/page\/\d+/;
export const QUOTED_POST_API = /^https:\/\/lihkg\.com\/api_v2\/thread\/(\d+)\/[a-f0-9]+$/
export const HEX_COLOR = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i;
