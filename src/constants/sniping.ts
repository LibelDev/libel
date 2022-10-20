import { displayName } from '../../package.json';
import { promotion, snipingItems, snipingItemsImageOnly, subscriptionItems, userId, userNickname, userRegistrationDate } from '../templates/sniping/external';

// export const USER_REGISTRATION_DATE_FORMAT = 'yyyy年MM月dd日';

export const SNIPING_TEMPLATE_DRAFT_TITLE = `${displayName}狙擊範本`;

export const SNIPING_TEMPLATE_VARIABLES_MAPPING = {
  '會員編號': userId,
  '會員名稱': userNickname,
  /**
   * @deprecated LIHKG no longer provides `create_time` in user profile since 20/10/2022
   */
  '註冊日期': userRegistrationDate,
  '標籤項目': snipingItems,
  '標籤截圖': snipingItemsImageOnly,
  '訂閱名單': subscriptionItems,
  '宣傳簽名': promotion
};
