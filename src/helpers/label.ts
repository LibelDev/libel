import { render } from 'mustache';
import cache from '../cache';
import * as TEXTS from '../constants/texts';
import { format, Format } from '../helpers/date';
import { getUserRegistrationDate } from '../helpers/lihkg';
import { IDataSet } from '../models/DataSet';
import { ILabel } from '../models/Label';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import { snipeBody, snipeLabelItem, subscriptionItem, snipeFooter } from '../templates/snipe';
import { filterDataSetForUser } from './../store/selectors';

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

export const renderSnipeBody = (userID: string, personal: Personal, subscriptions: Subscription[]) => {
  const user = cache.getUser(userID);
  if (user) {
    const dataSets = ([] as (Personal | Subscription)[])
      .concat(personal, subscriptions)
      .map((dataSet) => filterDataSetForUser(dataSet, userID));
    const view = {
      user: {
        ...user,
        registrationDate: format(getUserRegistrationDate(user), Format.Display)
      },
      labels: dataSets.reduce<any[]>((labels, dataSet) => {
        const _labels = (dataSet.data[userID] || []).map((label) => ({
          ...label,
          sourceURL: label.sourceURL,
          subscription: Subscription.implements(dataSet) ? dataSet : null
        }));
        return labels.concat(_labels);
      }, []),
      subscriptions
    };
    const partials = { snipeLabelItem, subscriptionItem, snipeFooter };
    return render(snipeBody.trim(), view, partials);
  }
};
