import { displayName } from '../../package.json';

/* title */
export const LIHKG_MODAL_TITLE_USER_CARD = '會員資料';
export const LIHKG_MODAL_TITLE_SETTINGS = '設定';

/* settings */
export const SETTINGS_TITLE_SUBSCRIPTION = '訂閱標籤名單';
export const SETTINGS_TITLE_CLOUD_SYNC = '雲端同步資料';
export const SETTINGS_TITLE_MANAGE_DATA = '管理資料';
export const SETTINGS_TITLE_CLEAR_DATA = '清除資料';

/* buttons */
export const BUTTON_TEXT_LABEL_ADD = '標籤';
export const BUTTON_TEXT_LABEL_EDIT = '修改';
export const BUTTON_TEXT_LABEL_REMOVE = '刪除';
export const BUTTON_TEXT_LABEL_SOURCE = '來源';
export const BUTTON_TEXT_LABEL_IMAGE = '相關圖片';
export const BUTTON_TEXT_SNIPE = '一鍵狙擊';

/* label */
export const BLOCKED_USER_DEFAULT_LABEL_TEXT = '封鎖會員';
export const LABEL_REASON_EMPTY_TEXT = '未有記錄標籤原因';

/* label form */
export const LABEL_FORM_MODAL_TITLE_ADD_LABEL = '新增標籤';
export const LABEL_FORM_MODAL_TITLE_EDIT_LABEL = '修改標籤';
export const LABEL_FORM_FIELD_LABEL_TEXT = '標籤';
export const LABEL_FORM_FIELD_LABEL_REASON = '原因';
export const LABEL_FORM_FIELD_LABEL_CUSTOM_COLOR = '自訂顏色';
export const LABEL_FORM_FIELD_LABEL_CAPTURE = '自動將目標留言截圖';
export const LABEL_FORM_FIELD_LABEL_IMAGE = '相關圖片網址';
export const LABEL_FORM_CAPTURE_PREVIEW_LABEL_TEXT = '預覽截圖';
export const LABEL_FORM_CAPTURE_ERROR = '截圖失敗，請重新嘗試。';
export const LABEL_FORM_FIELD_PLACEHOLDER_REASON = '如無需要可留空';
export const LABEL_FORM_FIELD_PLACEHOLDER_IMAGE = '如無需要可留空';
export const LABEL_FORM_FIELD_ERROR_TEXT_REQUIRED = '必須填寫標籤名稱';
export const LABEL_FORM_FIELD_ERROR_IMAGE_INVALID = '只可以填寫網址';
export const LABEL_FORM_FIELD_ERROR_FAILED_TO_UPLOAD = '圖片上截失敗，請稍後再試。';
export const BUTTON_TEXT_LABEL_FORM_SUBMIT = '確定';

/* editor */
export const SPREADSHEET_COLUMN_HEADER_USER_ID = '會員編號';
export const SPREADSHEET_COLUMN_HEADER_LABEL_TEXT = '標籤';
export const SPREADSHEET_COLUMN_HEADER_LABEL_REASON = '原因';
export const SPREADSHEET_COLUMN_HEADER_LABEL_DATE = '日期';
export const SPREADSHEET_COLUMN_HEADER_LABEL_SOURCE = '來源';
export const SPREADSHEET_COLUMN_HEADER_LABEL_COLOR = '顏色';
export const SPREADSHEET_COLUMN_HEADER_LABEL_IMAGE = '截圖';
export const BUTTON_TEXT_EDIT_DATA_SET = '編輯個人標籤記錄';
export const BUTTON_TEXT_DATA_SET_EDITOR_SAVE = '儲存';
export const DATA_SET_EDITOR_MODAL_TITLE = '編輯標籤';
export const DATA_SET_EDITOR_MESSAGE_SAVE_CONFIRMATION = '你確定要儲存個人標籤記錄嗎？';
export const DATA_SET_EDITOR_MESSAGE_SAVE_SUCCESS = '已儲存個人標籤記錄';
export const DATA_SET_EDITOR_MESSAGE_EMPTY_DATA_SET = '未有任何個人標籤記錄';
export const DATA_SET_EDITOR_MESSAGE_CLOSE_CONFIRMATION = `你確定要放棄變更並關閉【${DATA_SET_EDITOR_MODAL_TITLE}】？`;
export const DATA_SET_EDITOR_FILTER_PLACEHOLDER = '搜尋用戶編號、標籤名稱或原因...';
export const DATA_SET_EDITOR_FILTER_MESSAGE_EMPTY_RESULT = '沒有找到相關記錄';
export const DATA_SET_EDITOR_ERROR_INVALID = '標籤資料錯誤，請修正後再儲存。';
export const LABEL_EDITOR_FIELD_PLACEHOLDER_LABEL_TEXT = '標籤';
export const LABEL_EDITOR_FIELD_PLACEHOLDER_LABEL_REASON = '原因';
export const LABEL_EDITOR_LABEL_ITEM_HINT_TEXT_REMOVE = '標籤會於儲存後被刪除';

/* make subscription */
export const BUTTON_TEXT_MAKE_SUBSCRIPTION = '將個人標籤記錄製作成訂閱名單';
export const SUBSCRIPTION_MAKER_MODAL_TITLE = '製作訂閱名單';
export const SUBSCRIPTION_MAKER_FIELD_LABEL_TEMPLATE = '訂閱名單';
export const SUBSCRIPTION_MAKER_TEMPLATE_OPTION_DEFAULT = '新訂閱名單';
export const SUBSCRIPTION_MAKER_FIELD_LABEL_NAME = '名稱';
export const SUBSCRIPTION_MAKER_FIELD_LABEL_VERSION = '版本';
export const SUBSCRIPTION_MAKER_FIELD_LABEL_HOMEPAGE = '網站';
export const SUBSCRIPTION_MAKER_FIELD_LABEL_COLOR = '主題顏色';
export const SUBSCRIPTION_MAKER_FIELD_PLACEHOLDER_HOMEPAGE = '如無需要可留空';
export const SUBSCRIPTION_MAKER_FIELD_ERROR_NAME_REQUIRED = '必須填寫名稱';
export const SUBSCRIPTION_MAKER_FIELD_ERROR_VERSION_REQUIRED = '必須填寫版本';
export const SUBSCRIPTION_MAKER_FIELD_ERROR_HOMEPAGE_INVALID = '只可以填寫網址';
export const BUTTON_TEXT_SUBSCRIPTION_MAKER_REMOVE_TEMPLATE = '刪除訂閱名單';
export const BUTTON_TEXT_SUBSCRIPTION_MAKER_SUBMIT = '確定';
export const SUBSCRIPTION_MAKER_MESSAGE_REMOVE_TEMPLATE_CONFIRMATION = '確認要刪除製作過的訂閱名單嗎？';

/* export */
export const BUTTON_TEXT_EXPORT_FILE = '匯出資料及設定';

/* import */
export const BUTTON_TEXT_IMPORT_FILE = '匯入資料及設定';
export const IMPORT_FILE_ERROR_GENERIC_ERROR = '檔案匯入失敗';
export const IMPORT_FILE_ERROR_INVALID_DATA_FORMAT = '檔案內容格式錯誤';

/* clear local data */
export const BUTTON_TEXT_CLEAR_LOCAL_DATA = '從本裝置清除資料及重置設定';
export const CLEAR_LOCAL_DATA_MESSAGE_CLEAR_CONFIRMATION = '請問你已匯出資料作備份用途並確定要清除個人標籤記錄、訂閱名單及重置設定嗎？';
export const CLEAR_LOCAL_DATA_MESSAGE_CLEAR_DOUBLE_CONFIRMATION = `請輸入 "${displayName}" 確認清除個人標籤記錄、訂閱名單及重置設定`;
export const CLEAR_LOCAL_DATA_MESSAGE_CLEAR_SUCCESS = '已成功從本裝置清除個人標籤記錄、訂閱名單及重置設定';
export const CLEAR_LOCAL_DATA_MESSAGE_CLEAR_CANCELED = '已取消清除本裝置資料';

/* clear cloud data */
export const BUTTON_TEXT_CLEAR_CLOUD_DATA = '從雲端清除資料及重置設定';
export const CLEAR_CLOUD_DATA_MESSAGE_CLEAR_CONFIRMATION = '請問你已匯出資料作備份用途並確定要清除個人標籤記錄、訂閱名單及重置設定嗎？';
export const CLEAR_CLOUD_DATA_MESSAGE_CLEAR_DOUBLE_CONFIRMATION = `請輸入 "${displayName}" 確認清除個人標籤記錄、訂閱名單及重置設定`;
export const CLEAR_CLOUD_DATA_MESSAGE_CLEAR_SUCCESS = '已成功從雲端清除個人標籤記錄、訂閱名單及重置設定';
export const CLEAR_CLOUD_DATA_MESSAGE_CLEAR_CANCELED = '已取消清除雲端資料';

/* subscription */
export const BUTTON_TEXT_ADD_SUBSCRIPTION = '新增訂閱';
export const SUBSCRIPTION_MESSAGE_QUESTION_ADD = '請輸入標籤訂閱名單連結';
export const BUTTON_TEXT_ENABLE_SUBSCRIPTION = '啟用訂閱';
export const BUTTON_TEXT_REMOVE_SUBSCRIPTION = '取消訂閱';
export const BUTTON_TEXT_DISABLE_SUBSCRIPTION = '停用訂閱';
export const BUTTON_TEXT_RELOAD_SUBSCRIPTION = '重新載入';
export const BUTTON_TEXT_SUBSCRIPTION_HOMEPAGE = '標籤訂閱名單主頁';
export const SUBSCRIPTION_MESSAGE_LOAD_SUCCESS = '成功載入名單';
export const SUBSCRIPTION_ERROR_FAILED_TO_FETCH = '無法取得訂閱名單，請檢查連結是否正確。';
export const SUBSCRIPTION_ERROR_INVALID_DATA_FORMAT = '訂閱名單格式錯誤，請聯絡作者。';
export const SUBSCRIPTION_LIST_MESSAGE_EMPTY = '未有任何訂閱名單';

/* cloud sync */
export const CLOUD_SYNC_LABEL_GOOGLE_DRIVE = 'Google 雲端硬碟';
export const BUTTON_TEXT_GOOGLE_AUTHORIZE = '連接';
export const BUTTON_TEXT_GOOGLE_SIGNOUT = '登出';
export const BUTTON_TEXT_CLOUD_SYNC_SYNC_NOW = '立即同步';
export const CLOUD_SYNC_LABEL_PREFIX_CONNECTED_ACCOUNT = '已連接';
export const CLOUD_SYNC_LABEL_SYNC_IN_PROGRESS = '正在同步資料';
export const CLOUD_SYNC_ERROR_GENERIC_ERROR = '資料同步失敗，請嘗試重新連接。';
export const CLOUD_SYNC_MESSAGE_GOOGLE_DRIVE_SIGNIN_SUCCESS = `已連接至 ${CLOUD_SYNC_LABEL_GOOGLE_DRIVE}`;
export const CLOUD_SYNC_MESSAGE_GOOGLE_DRIVE_SIGNIN_FAILED = `未能連接至 ${CLOUD_SYNC_LABEL_GOOGLE_DRIVE}`;
export const CLOUD_SYNC_MESSAGE_GOOGLE_DRIVE_SIGNOUT_SUCCESS = `已中斷連接 ${CLOUD_SYNC_LABEL_GOOGLE_DRIVE}`;
export const CLOUD_SYNC_MESSAGE_SYNC_IN_PROGESS = '正在進行雲端資料同步';
export const CLOUD_SYNC_MESSAGE_SYNC_SUCCESS = '雲端資料同步成功';
export const CLOUD_SYNC_MESSAGE_SYNC_FAILED = '雲端資料同步發生錯誤，請查看設定了解詳情。';

/* convert blocked users */
export const BUTTON_TEXT_CONVERT_BLOCKED_USERS = '將封鎖用戶轉換成個人標籤記錄';
export const CONVERT_BLOCKED_USERS_ERROR_FAILED_TO_FETCH_BLOCKED_USERS = '無法取得封鎖用戶資料，請重新嘗試。';
export const CONVERT_BLOCKED_USERS_ERROR_GENERIC_ERROR = '轉換失敗，請重新嘗試。';
export const CONVERT_BLOCKED_USERS_MESSAGE_NO_BLOCKED_USERS = '未有封鎖用戶記錄';
export const CONVERT_BLOCKED_USERS_HINT_TEXT_UNBLOCK = '建議轉換後解除封鎖用戶';

/* announcement */
export const BUTTON_TEXT_CLOSE_ANNOUNCEMENT = '關閉公告';
export const ANNOUNCEMENT_LABEL_CHANGE_LOG = '更新內容';
export const ANNOUNCEMENT_MESSAGE_DONT_SHOW_AGAIN_CONFIRMATION = '七天內不再顯示此公告？';

/* plugin info */
export const BUTTON_TEXT_SOURCE_CODE = 'Source code';
export const BUTTON_TEXT_LICENSE = 'MIT License';

/* emote menu */
export const BUTTON_TEXT_UNLOCK_ICON_MAP = '解鎖全部表情';
