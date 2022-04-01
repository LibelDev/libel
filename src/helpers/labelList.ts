import type { IDataSet } from '../models/DataSet';
import type { ILabel } from '../models/Label';

/**
 * labels group item
 * @typedef {string} user the user ID
 * @typedef {number} index the index in the array of the labels
 * @typedef {ILabel} label the label object
 * @typedef {IDataSet} dataSet the corresponding dataSet of the label
 */
export type TLabelsGroupItem = [user: string, index: number, label: ILabel, dataSet: IDataSet];

interface IGroupedLabel {
  text: string;
  items: TLabelsGroupItem[];
}

export const mapDataSetsToLabelsGroupsGroupedByText = (dataSets: IDataSet[]) => {
  return dataSets.reduce<IGroupedLabel[]>((labelsGroups, dataSet) => {
    const users = Object.keys(dataSet.data);
    for (const user of users) {
      const labels = dataSet.data[user] || [];
      for (let index = 0; index < labels.length; index++) {
        const label = labels[index];
        let labelsGroup = labelsGroups.find(({ text }) => text === label.text);
        if (!labelsGroup) {
          labelsGroup = { text: label.text, items: [] };
          labelsGroups.push(labelsGroup);
        }
        labelsGroup.items.push([user, index, label, dataSet]);
      }
    }
    return labelsGroups;
  }, []);
};
