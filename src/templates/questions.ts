export const remove = {
  label: '確認刪除【{{ user.nickname }}】的標籤【{{ label.text }}】？',
  subscription: '確認取消訂閱{{ #subscription.name }}【{{ . }}】{{ /subscription.name }}？\n\n{{{ subscription.url }}}'
};

export const convert = {
  merge: '確認要將 {{ users.length }} 個封鎖用戶合併到個人標籤記錄嗎？'
};
