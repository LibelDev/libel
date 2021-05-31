import { render } from 'mustache';
import cache from '../cache';
import * as TEXTS from '../constants/texts';
import { getUserRegistrationDate } from '../helpers/lihkg';
import Label, { ILabel } from '../models/Label';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import { snipingBody, snipingFooter, snipingHeader, snipingLabelItem, subscriptionItem } from '../templates/sniping';
import { filterDataSetForUser } from './../store/selectors';
import { format, Format } from './date';

const prompt = (defaultText = '', defaultReason = '') => {
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

export const promptAdd = () => {
  const data = prompt();
  if (data) {
    const isScreenshotEnabled = window.confirm(TEXTS.ADD_LABEL_ENABLE_SCREENSHOT_QUESTION);
    return {
      ...data,
      isScreenshotEnabled
    };
  }
};

export const promptEdit = (text: string, reason?: string, image = '') => {
  const data = prompt(text, reason);
  if (data) {
    const _image = window.prompt(TEXTS.ADD_LABEL_SCREENSHOT_QUESTION, image);
    if (_image !== null) {
      return {
        ...data,
        image: _image?.trim()
      };
    }
  }
};

interface ISnipeLabelItem extends ILabel {
  sourceURL: Label['sourceURL'];
  subscription: Subscription | null;
}

export const renderSnipingBody = (userID: string, personal: Personal, subscriptions: Subscription[]) => {
  const user = cache.getUser(userID);
  if (user) {
    const dataSets = ([] as (Personal | Subscription)[])
      .concat(personal, subscriptions)
      .map((dataSet) => filterDataSetForUser(dataSet, userID));
    const labels = dataSets.reduce<ISnipeLabelItem[]>((labels, dataSet) => {
      const _labels = (dataSet.data[userID] || []).map((label) => ({
        ...label,
        sourceURL: label.sourceURL,
        subscription: Subscription.implements(dataSet) ? dataSet : null
      }));
      return labels.concat(_labels);
    }, []);
    const view = {
      user: {
        ...user,
        registrationDate: format(getUserRegistrationDate(user), Format.Display)
      },
      labels,
      subscriptions
    };
    const partials = { snipingHeader, snipingLabelItem, subscriptionItem, snipingFooter };
    return render(snipingBody.trim(), view, partials);
  }
};
