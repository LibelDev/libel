export const stats = {
  total: '共 {{ users.length }} 個會員、{{ labels.length }} 個標籤、{{ subscriptions.length }} 個訂閱'
};

export const success = {
  import: `成功匯入${stats.total}`,
  export: `成功匯出${stats.total}`
};

export const sync = {
  lastSyncedTime: '最後同步於 {{ lastSyncedTime }}',
  nextSyncTime: '下次同步時間為 {{ nextSyncTime }}'
};
