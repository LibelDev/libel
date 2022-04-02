import { displayName } from '../../package.json';
import { promotion, snipingItems, snipingItemsImageOnly, subscriptionItems, userID, userNickname, userRegistrationDate } from '../templates/sniping/external';

export const SNIPING_TEMPLATE_DRAFT_TITLE = `${displayName}狙擊範本`;

export const SNIPING_TEMPLATE_VARIABLES_MAPPING = {
  '會員編號': userID,
  '會員名稱': userNickname,
  '註冊日期': userRegistrationDate,
  '標籤項目': snipingItems,
  '標籤截圖': snipingItemsImageOnly,
  '訂閱名單': subscriptionItems,
  '宣傳簽名': promotion
};
