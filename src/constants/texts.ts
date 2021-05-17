import { namespace } from '../../package.json';
import * as PLACEHOLDERS from './placeholders';

// thread
export const THREAD_USER_LABELS_TOOLTIP = '會員標籤';

// title
export const USER_CARD_MODAL_TITLE = '會員資料';
export const SETTINGS_MODAL_TITLE = '設定';
export const SETTING_SUBSCRIPTION_SECTION_TITLE = '訂閱標籤名單';
export const SETTING_EXPORT_IMPORT_SECTION_TITLE = '匯出／匯入標籤記錄';

// add
export const ADD_LABEL_BUTTON_TEXT = '標籤';
export const ADD_LABEL_QUESTION = '請輸入標籤';
export const ADD_LABEL_REASON_QUESTION = '標籤原因';

// remove
export const REMOVE_LABEL_BUTTON_TEXT = '刪除';
export const REMOVE_LABEL_QUESTION = `確認刪除【${PLACEHOLDERS.USERNAME}】的標籤【${PLACEHOLDERS.LABEL_TEXT}】？`;

// info
export const EDIT_LABEL_BUTTON_TEXT = '修改';
export const SOURCE_BUTTON_TEXT = '來源';

// snipe
export const SNIPE_BUTTON_TEXT = '狙擊';

// import
export const IMPORT_FILE_BUTTON_TEXT = '匯入記錄';
export const IMPORT_FILE_BUTTON_REMINDER = '所有記錄將會被覆蓋，建議先匯出一次作備份。';
export const IMPORT_FILE_SUCCESS_MESSAGE = `檔案匯入成功，共 ${PLACEHOLDERS.NUM_USERS} 個會員、${PLACEHOLDERS.NUM_LABELS} 個標籤、${PLACEHOLDERS.NUM_SUBSCRIPTIONS} 個訂閱`;
export const IMPORT_FILE_GENERIC_ERROR_MESSAGE = '檔案匯入失敗';
export const IMPORT_FILE_DATA_FORMAT_ERROR_MESSAGE = '檔案內容格式錯誤';

// export
export const EXPORT_FILE_BUTTON_TEXT = '匯出記錄';
export const EXPORT_FILE_SUCCESS_MESSAGE = `檔案匯出成功，共 ${PLACEHOLDERS.NUM_USERS} 個會員、${PLACEHOLDERS.NUM_LABELS} 個標籤、${PLACEHOLDERS.NUM_SUBSCRIPTIONS} 個訂閱`;
export const EXPORT_FILE_NAME_TEMPLATE = `${namespace}-${PLACEHOLDERS.TIMESTAMP}.json`;

// subscription
export const ADD_SUBSCRIPTION_BUTTON_TEXT = '新增訂閱';
export const ADD_SUBSCRIPTION_QUESTION = '請輸入標籤名單訂閱連結';
export const ADD_SUBSCRIPTION_ALREADY_SUBSCRIBED_ERROR = `已訂閱此標籤名單【${PLACEHOLDERS.SUBSCRIPTION_NAME}】\n\n${PLACEHOLDERS.SUBSCRIPTION_URL}`;
export const REMOVE_SUBSCRIPTION_BUTTON_TEXT = '取消訂閱';
export const REMOVE_SUBSCRIPTION_QUESTION = `確認取消訂閱【${PLACEHOLDERS.SUBSCRIPTION_NAME}】？\n\n${PLACEHOLDERS.SUBSCRIPTION_URL}`;
export const ENABLE_SUBSCRIPTION_BUTTON_TEXT = '啟用訂閱';
export const DISABLE_SUBSCRIPTION_BUTTON_TEXT = '停用訂閱';
export const RELOAD_SUBSCRIPTION_BUTTON_TEXT = '重新載入';
export const SUBSCRIPTION_HOMEPAGE_BUTTON_TEXT = '標籤名單主頁';
export const SUBSCRIPTION_LOAD_SUCCESS = '成功載入名單';
export const SUBSCRIPTION_FETCH_ERROR = '無法取得標籤名單，請檢查連結是否正確。';
export const SUBSCRIPTION_VALIDATION_ERROR = '標籤名單格式錯誤，無法載入，請聯絡名單作者。';

// announcement
export const ANNOUNCEMENT_CLOSE_BUTTON_TEXT = '關閉公告';
