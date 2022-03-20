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