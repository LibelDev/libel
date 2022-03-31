import type { IDataSet } from './../models/DataSet';
import type { ILabel } from './../models/Label';

export interface IGroupedLabelItem {
  user: string;
  index: number;
  label: ILabel;
  dataSet: IDataSet;
}

export interface IGroupedLabel {
  text: string;
  items: IGroupedLabelItem[];
}

/**
 * labels group item
 * @typedef {ILabel} origianl the original object that will not be updated
 * @typedef {ILabel} draft the draft object that will be updated
 */
type ILabelsGroupItem = [original: ILabel, draft: ILabel, removed: boolean];

export interface ILabelsGroupGroupedByUser {
  user: string;
  items: ILabelsGroupItem[];
}
