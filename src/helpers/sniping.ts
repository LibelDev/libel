import { render } from 'mustache';
import cache from '../cache';
import { getUserRegistrationDate } from '../helpers/lihkg';
import type { ILabel } from '../models/Label';
import Personal from '../models/Personal';
import Subscription from '../models/Subscription';
import defaultTemplate, { promotion, snipingHeader, snipingLabelImage, snipingLabelItem, subscriptionItem } from '../templates/sniping';
import type { IDraft } from '../types/lihkg';
import { SNIPING_TEMPLATE_DRAFT_TITLE, SNIPING_TEMPLATE_VARIABLES_MAPPING } from './../constants/sniping';
import { DRAFTS_KEY } from './../constants/storage';
import { createDataSetUserFilter } from './../store/selectors';
import { format, Format } from './date';
import { localStorage } from './storage';

interface ISnipeLabelItem extends ILabel {
  shareURL?: string;
  subscription: Subscription | null;
}

const getCustomTemplate = () => {
  const json = localStorage.getItem(DRAFTS_KEY);
  const drafts = (json && JSON.parse(json) || []) as IDraft[];
  const draft = drafts.find((draft) => draft.title === SNIPING_TEMPLATE_DRAFT_TITLE);
  return draft?.content;
};

const getTemplate = () => {
  const customTemplate = getCustomTemplate();
  const body = customTemplate || defaultTemplate;
  return render(
    body,
    SNIPING_TEMPLATE_VARIABLES_MAPPING,
    {},
    { tags: ['__', '__'] }
  );
};

export const renderSnipingBody = (userID: string, personal: Personal, subscriptions: Subscription[]) => {
  const user = cache.getUser(userID);
  if (user) {
    const _subscriptions = subscriptions.filter((subscription) => !!subscription.data[userID]);
    const dataSets = ([] as (Personal | Subscription)[])
      .concat(personal, _subscriptions)
      .map(createDataSetUserFilter(userID));
    const labels = dataSets.reduce<ISnipeLabelItem[]>((labels, dataSet) => {
      const _labels = (dataSet.data[userID] || []).map((label) => ({
        ...label,
        shareURL: label.shareURL,
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
      subscriptions: _subscriptions
    };
    const snipingTemplate = getTemplate();
    const partials = { snipingHeader, snipingLabelItem, snipingLabelImage, subscriptionItem, promotion };
    return render(snipingTemplate, view, partials);
  }
};
