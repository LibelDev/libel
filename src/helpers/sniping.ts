import { render } from 'mustache';
import { IDraft } from '../types/lihkg';
import { SNIPING_TEMPLATE_DRAFT_TITLE } from './../constants/sniping';
import { DRAFTS_KEY } from './../constants/storage';
import { snipingTemplate } from './../templates/sniping';
import { localStorage } from './storage';

const getSnipingTemplateDraft = () => {
  const json = localStorage.getItem(DRAFTS_KEY);
  const drafts = (json && JSON.parse(json) || []) as IDraft[];
  return drafts.find((draft) => draft.title === SNIPING_TEMPLATE_DRAFT_TITLE);
};

export const getSnipingTemplate = () => {
  const draft = getSnipingTemplateDraft();
  if (draft) {
    const view = {
      '會員編號': '{{ user.user_id }}',
      '會員名稱': '{{ user.nickname }}',
      '註冊日期': '{{ user.registrationDate }}',
      '標籤項目': '{{ #labels }}{{ >snipingLabelItem }}\n\n{{ /labels }}',
      '訂閱名單': '{{ #subscriptions.length }}-------------\n{{ #subscriptions }}{{ >subscriptionItem }}{{ /subscriptions }}{{ /subscriptions.length }}',
      '宣傳簽名': '-------------\n{{ >snipingFooter }}'
    };
    return render(draft.content, view, {}, {
      tags: ['__', '__']
    });
  }
  return snipingTemplate;
};
