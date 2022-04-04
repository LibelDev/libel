import format from 'date-fns/format';
import { displayDateFormat } from '../constants/label';
import { shortenedHost } from '../constants/lihkg';
import type { IPost } from '../types/lihkg';
import type { ILabel, ISource } from './../models/Label';
import { counter } from './counter';
import { getShareID } from './lihkg';

export const mapPostToSource = (post: IPost): ISource => {
  return {
    thread: post.thread_id,
    page: post.page,
    messageNumber: post.msg_num
  };
};

const getLastID = (labels: ILabel[]) => {
  const _labels = labels.filter((label) => !!label.id);
  _labels.sort((a, b) => parseInt(b.id!) - parseInt(a.id!));
  const last = _labels[0];
  return last ? last.id! : '0';
};

export const getNextLabelID = (labels: ILabel[]) => {
  const lastID = getLastID(labels);
  const initial = parseInt(lastID) + 1;
  const count = counter(initial);
  while (true) {
    const { value } = count.next();
    const id = `${value}`;
    const label = labels.find((label) => label.id === id);
    if (!label) {
      return id;
    }
  }
};

export const getShareURL = (label: ILabel) => {
  const { source } = label;
  if (source) {
    const shareID = getShareID(source);
    return `${shortenedHost}/${shareID}`;
  }
  // fallback to the deprecated url
  return label.url;
};

export const getDisplayDate = (label: ILabel, dateFormat = displayDateFormat) => {
  const { date } = label;
  if (date) {
    return format(date, dateFormat);
  }
};

/**
 * compare two label objects to check equality
 * @param {ILabel} labelA the target A
 * @param {ILabel} labelB the target B
 * @param {boolean} [strict=false] enable strict equality checking
 */
export const isEqual = (labelA: ILabel, labelB: ILabel, strict = false) => {
  if (labelA.id && labelB.id) {
    // `id` determines everything
    return labelA.id === labelB.id;
  }
  /**
   * either one of them is stale
   * attempt to compare something else
   */
  return (
    labelA.text === labelB.text
    && (
      strict ? (
        labelA.reason === labelB.reason
      ) : true
    )
  );
};
