import cache from '../cache';
import * as PLACEHOLDERS from '../constants/placeholders';
import * as TEMPLATES from '../constants/templates';
import * as TEXTS from '../constants/texts';
import { format, Format } from '../helpers/date';
import { getUserRegistrationDate } from '../helpers/lihkg';
import { IDataSet } from '../models/DataSet';
import { ILabel } from '../models/Label';
import { IPersonal } from '../models/Personal';
import { ISubscription } from '../models/Subscription';

export const prompt = (defaultText = '', defaultReason = '') => {
  const text = (window.prompt(TEXTS.ADD_LABEL_QUESTION, defaultText) || '').trim();
  if (text) {
    const reason = window.prompt(TEXTS.ADD_LABEL_REASON_QUESTION, defaultReason);
    if (reason !== null) {
      return {
        text,
        reason: reason.trim()
      };
    }
  }
};

export const getSourceURL = (label: ILabel) => {
  const { url, source } = label;
  if (source) {
    const { thread, page, messageNumber } = source;
    return `https://lihkg.com/thread/${thread}/page/${page}?post=${messageNumber}`;
  }
  return url;
};

export const aggregate = (dataSet: IDataSet) => {
  const { data } = dataSet;
  const users = Object.keys(data);
  const labels = users.reduce<ILabel[]>((labels, user) => {
    const _labels = data[user] || [];
    labels = labels.concat(_labels);
    return labels;
  }, []);
  return { users, labels };
};

export const generateSnipeBody = (user: string, personal: IPersonal, subscriptions: ISubscription[]) => {
  const _user = cache.getUser(user);
  if (_user) {
    const dataSets = ([] as (IPersonal | ISubscription)[]).concat(personal, subscriptions);
    const content = dataSets.reduce<string[]>((items, dataSet) => {
      const labels = dataSet.data[user] || [];
      const content = labels.map((label) => {
        const { text, reason } = label;
        const sourceURL = getSourceURL(label);
        return TEMPLATES.SNIPE_LABEL_ITEM_CONTENT_TEMPLATE
          .replace(PLACEHOLDERS.LABEL_TEXT, text)
          .replace(PLACEHOLDERS.REASON, reason || TEXTS.SNIPE_EMPTY_REASON_FALLBACK)
          .replace(PLACEHOLDERS.SOURCE_URL, sourceURL || TEXTS.SNIPE_EMPTY_SOURCE_URL_FALLBACK);
      });
      return items.concat(content);
    }, []).join('\n\n');
    const registrationDate = getUserRegistrationDate(_user);
    const body = TEMPLATES.SNIPE_BODY_TEMPLATE
      .replace(PLACEHOLDERS.USER_ID, _user.user_id)
      .replace(PLACEHOLDERS.USERNAME, _user.nickname)
      .replace(PLACEHOLDERS.REGISTRATION_DATE, format(registrationDate, Format.Display))
      .replace(PLACEHOLDERS.SNIPE_LABELS_CONTENT, content);
    return body;
  }
};
