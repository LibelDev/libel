import type { IDataSet } from '../models/DataSet';
import Label, { ILabel } from '../models/Label';
import Personal from '../models/Personal';
import { getSearchRegex } from './regex';

/**
 * labels group item
 * @typedef {ILabel} origianl the original object that will not be updated
 * @typedef {ILabel} draft the draft object that will be updated
 */
export type ILabelsGroupItem = [original: ILabel, draft: ILabel, removed: boolean];

interface ILabelsGroupGroupedByUser {
  user: string;
  items: ILabelsGroupItem[];
}

export const mapDataSetToLabelsGroupsGroupedByUser = (dataSet: IDataSet) => {
  const users = Object.keys(dataSet.data);
  return users.map<ILabelsGroupGroupedByUser>((user) => {
    const labels = dataSet.data[user] || [];
    const items: ILabelsGroupItem[] = labels.map((label) => [label, label, false]);
    const labelsGroup: ILabelsGroupGroupedByUser = { user, items };
    return labelsGroup;
  });
};

export const mapLabelsGroupsGroupedByUserToDataSet = (labelsGroups: ILabelsGroupGroupedByUser[]) => {
  const dataSet = Personal.factory();
  const { data } = dataSet;
  for (const labelsGroup of labelsGroups) {
    const { user, items } = labelsGroup;
    const labels = items
      .filter(([, , removed]) => !removed)
      .map(([, draft]) => Label.deserialize(draft));
    if (labels.length > 0) {
      data[user] = labels;
    }
  }
  return dataSet;
};

export const filterLabelsGroupsByKeyword = <T extends ILabelsGroupGroupedByUser> (labelsGroups: T[], keyword: string) => {
  if (keyword === '') {
    return labelsGroups;
  }
  const regex = getSearchRegex(keyword);
  return labelsGroups.reduce<T[]>((labelsGroups, labelsGroup) => {
    const { user, items } = labelsGroup;
    if (regex.test(user)) {
      labelsGroups.push(labelsGroup);
    } else {
      const labelsGroup = {
        user,
        items: items.filter((item) => {
          const [original, draft] = item;
          return (
            regex.test(original.text)
            || (original.reason && regex.test(original.reason))
            || regex.test(draft.text)
            || (draft.reason && regex.test(draft.reason))
          );
        })
      } as T;
      if (labelsGroup.items.length > 0) {
        // push only when it has at least one label
        labelsGroups.push(labelsGroup);
      }
    }
    return labelsGroups;
  }, []);
};

export const findLabelsGroupByUser = <T extends ILabelsGroupGroupedByUser> (labelsGroups: T[], user: string): [number, T | undefined] => {
  const index = labelsGroups.findIndex((labelsGroup) => labelsGroup.user === user);
  const labelsGroup = labelsGroups[index];
  return [index, labelsGroup];
};
