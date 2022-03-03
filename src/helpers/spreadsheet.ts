import { IDataSet } from '../models/DataSet';
import Label from '../models/Label';
import Personal from '../models/Personal';

interface ISpreadsheetEntry {
  user: string;
  label: Label;
}

// type TSpreadsheetEntry = [
//   string,
//   string,
//   string | undefined,
//   string | undefined,
//   string | undefined,
//   string | undefined,
//   string | undefined
// ];

// type TSpreadsheet = TSpreadsheetEntry[];

export const mapDataSetToSpreadsheetEntries = (dataSet: IDataSet) => {
  const { data } = dataSet;
  const users = Object.keys(data);
  const entries = users.reduce<ISpreadsheetEntry[]>((entries, user) => {
    const labels = data[user] || [];
    const _entries: ISpreadsheetEntry[] = labels.map((label) => {
      return {
        user,
        // shallow clone, but enough
        label: label.clone()
      };
    });
    return entries.concat(_entries);
  }, []);
  return entries;
};

export const mapSpreadsheetEntriesToDataSet = (entries: ISpreadsheetEntry[]) => {
  const dataSet = Personal.factory();
  const { data } = dataSet;
  for (const entry of entries) {
    const { user, label } = entry;
    data[user] = data[user] || [];
    data[user]!.push(label.clone());
  }
  return dataSet;
};

// export const mapDataSetToCSV = (dataSet: DataSet) => {
//   const headerRow: TSpreadsheetEntry = [
//     TEXTS.SPREADSHEET_COLUMN_HEADER_USER_ID,
//     TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_TEXT,
//     TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_REASON,
//     TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_COLOR,
//     TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_IMAGE,
//     TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_SOURCE,
//     TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_DATE
//   ];
//   const csv: TSpreadsheet = [headerRow];
//   const { data } = dataSet;
//   const users = Object.keys(data);
//   for (const user of users) {
//     const labels = data[user]!;
//     for (const label of labels) {
//       const { text, reason, displayDate, shareURL, color, image } = label;
//       const entry: TSpreadsheetEntry = [user, text, reason, color, image, shareURL, displayDate];
//       csv.push(entry);
//     }
//   }
//   return csv;
// };
