import { shortenedHost } from '../constants/lihkg';
import type { IDataSet } from '../models/DataSet';
import type { IGroupedLabel } from '../types/label';
import type { IPost } from '../types/lihkg';
import type { ILabel, ISource } from './../models/Label';
import type { TTracablePost } from './../types/lihkg';
import { counter } from './counter';
import { getShareID } from './lihkg';

export const mapPostToSource = (post: IPost): ISource => {
  return {
    thread: post.thread_id,
    page: post.page,
    messageNumber: post.msg_num
  };
};

export const mapSourceToPost = (source: ISource): TTracablePost => {
  return {
    thread_id: source.thread,
    page: source.page,
    msg_num: source.messageNumber
  };
};

export const getAvailableLabelID = (labels: ILabel[]) => {
  const count = counter(1);
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
    const post = mapSourceToPost(source);
    const shareID = getShareID(post);
    return `${shortenedHost}/${shareID}`;
  }
  // fallback to the deprecated url
  return label.url;
};

export const groupByText = (user: string, dataSets: IDataSet[]) => {
  return dataSets.reduce<IGroupedLabel[]>((groupedLabels, dataSet) => {
    const labels = dataSet.data[user];
    if (labels) {
      for (let index = 0; index < labels.length; index++) {
        const label = labels[index];
        let groupedLabel = groupedLabels.find(({ text }) => text === label.text);
        if (!groupedLabel) {
          groupedLabel = { text: label.text, items: [] };
          groupedLabels.push(groupedLabel);
        }
        groupedLabel.items.push({ user, index, label, dataSet });
      }
    }
    return groupedLabels;
  }, []);
};

/**
 * compare two label objects to check equality
 * @param {ILabel} labelA the target A to be compare
 * @param {ILabel} labelB the target B to be compare
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
