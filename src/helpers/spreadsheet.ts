// import { registerCellType, TextCellType } from 'handsontable/cellTypes';
// import { AutoColumnSize, CopyPaste, DropdownMenu, Filters, registerPlugin, TrimRows, UndoRedo } from 'handsontable/plugins';
import { registerAllModules } from 'handsontable/registry';
import * as TEXTS from '../constants/texts';
import DataSet from '../models/DataSet';

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

export const mapDataSetToCSV = (dataSet: DataSet) => {
  const headerRow: TSpreadsheetEntry = [
    TEXTS.SPREADSHEET_COLUMN_HEADER_USER_ID,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_TEXT,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_REASON,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_COLOR,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_IMAGE,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_SOURCE,
    TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_DATE
  ];
  const csv: TSpreadsheet = [headerRow];
  const { data } = dataSet;
  const users = Object.keys(data);
  for (const user of users) {
    const labels = data[user]!;
    for (const label of labels) {
      const { text, reason, displayDate, sourceURL, color, image } = label;
      const entry: TSpreadsheetEntry = [user, text, reason, color, image, sourceURL, displayDate];
      csv.push(entry);
    }
  }
  return csv;
};

export const covertCSVToDataSet = (csv: TSpreadsheet) => {

};