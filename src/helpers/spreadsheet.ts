import * as TEXTS from '../constants/texts';
import type { IDataSet } from '../models/DataSet';
import { getDisplayDate, getShareURL } from './label';

type TSpreadsheetEntry = [
  string,
  string,
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined,
  string | undefined
];

type TSpreadsheet = TSpreadsheetEntry[];

export const mapDataSetToCSV = (dataSet: IDataSet) => {
  const header: TSpreadsheetEntry = [
    TEXTS.SPREADSHEET_COLUMN_HEADER_USER_ID,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_TEXT,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_REASON,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_COLOR,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_IMAGE,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_SOURCE,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_DATE
  ];
  const csv: TSpreadsheet = [header];
  const { data } = dataSet;
  const users = Object.keys(data);
  for (const user of users) {
    const labels = data[user]!;
    for (const label of labels) {
      const { text, reason, color, image } = label;
      const shareURL = getShareURL(label);
      const displayDate = getDisplayDate(label);
      const entry: TSpreadsheetEntry = [user, text, reason, color, image, shareURL, displayDate];
      csv.push(entry);
    }
  }
  return csv;
};
