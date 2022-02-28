import { HotTable } from '@handsontable/react';
import classNames from 'classnames';
import debugFactory from 'debug';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import React, { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import * as TEXTS from '../../constants/texts';
import { mapDataSetToSpreadsheetEntries, mapSpreadsheetEntriesToDataSet } from '../../helpers/spreadsheet';
import { replaceNewLines } from '../../helpers/string';
import Personal from '../../models/Personal';
import { color, image, reason, text } from '../../schemas/label';
import ColorCell from './Cells/ColorCell';
import ImageCell from './Cells/ImageCell';
import SourceCell from './Cells/SourceCell';
import UserIDCell from './Cells/UserIDCell';
import styles from './DataSetEditor.module.scss';

interface IProps {
  dataSet: Personal;
  onSave?: (dataSet: Personal) => void;
}

export type TProps = IProps & React.ComponentPropsWithoutRef<'form'>;

registerAllModules();

const debug = debugFactory('libel:component:DataSetEditor');

const columns: Handsontable.ColumnSettings[] = [
  /**
   * user
   */
  {
    type: 'text',
    data: 'user',
    readOnly: true,
    renderer: (hotInstance, cell, row, column, prop, user: string) => {
      ReactDOM.render(<UserIDCell user={user} />, cell);
    }
  },
  /**
   * text
   */
  {
    type: 'text',
    data: 'label.text',
    validator: (value, callback) => {
      const { error } = text.validate(value);
      callback(!error);
    }
  },
  /**
   * reason
   */
  {
    type: 'text',
    data: 'label.reason',
    validator: (value, callback) => {
      const { error } = reason.allow(null).validate(value);
      callback(!error);
    }
  },
  /**
   * color
   */
  {
    type: 'text',
    data: 'label.color',
    readOnly: true,
    renderer: (hotInstance, cell, row, column, prop, color?: string | null) => {
      cell.classList.add(styles.colorCell);
      const handleChange = (color?: string | null) => {
        hotInstance.setDataAtCell(row, column, color);
      };
      ReactDOM.render(<ColorCell color={color} onChange={handleChange} />, cell);
    },
    validator: (value, callback) => {
      const { error } = color.allow(null).validate(value);
      callback(!error);
    }
  },
  /**
   * image
   */
  {
    type: 'text',
    data: 'label.image',
    placeholder: TEXTS.SPREADSHEET_COLUMN_PLACEHOLDER_LABEL_IMAGE,
    renderer: function (hotInstance, cell, row, column, prop, src: string | null | undefined, cellProperties) {
      cell.classList.add('htCenter');
      if (src) {
        ReactDOM.render(<ImageCell src={src} />, cell);
      } else {
        Handsontable.renderers.TextRenderer.apply(this, [hotInstance, cell, row, column, prop, src, cellProperties]);
      }
    },
    validator: (value, callback) => {
      const { error } = image.allow(null).validate(value);
      callback(!error);
    }
  },
  /**
   * source
   */
  {
    type: 'text',
    data: 'label.sourceURL',
    readOnly: true,
    renderer: (hotInstance, cell, row, column, prop, href: string) => {
      cell.classList.add('htCenter');
      ReactDOM.render(<SourceCell href={href} />, cell);
    }
  },
  /**
   * date
   */
  {
    type: 'text',
    data: 'label.displayDate',
    readOnly: true,
    renderer: (hotInstance, cell, row, column, prop, value, cellProperties) => {
      cell.classList.add('htCenter');
      Handsontable.renderers.TextRenderer.apply(this, [hotInstance, cell, row, column, prop, value, cellProperties]);
    }
  }
];

const colHeaders = [
  TEXTS.SPREADSHEET_COLUMN_HEADER_USER_ID,
  TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_TEXT,
  TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_REASON,
  TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_COLOR,
  TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_IMAGE,
  TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_SOURCE,
  TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_DATE
];

const settings: Handsontable.GridSettings = {
  licenseKey: process.env.HANDSONTABLE_LICENSE_KEY,
  height: 300,
  width: 800,
  columns,
  colWidths: [80, 80, 200, 50, 60, 50, 180],
  colHeaders,
  rowHeaders: true,
  selectionMode: 'single',
  stretchH: 'all',
  wordWrap: false,
  // plugins
  autoColumnSize: false,
  contextMenu: false,
  copyPaste: true,
  dropdownMenu: true,
  filters: true,
  manualColumnMove: false,
  manualRowMove: false,
  trimRows: false,
  undo: true
};

const DataSetEditor: React.FunctionComponent<TProps> = (props) => {
  const { dataSet, className, onSave, ...otherProps } = props;

  // memoize the data to avoid changes from outside
  const entries = useMemo(() => mapDataSetToSpreadsheetEntries(dataSet), []);
  debug('entries', entries);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();
    const dataSet = mapSpreadsheetEntriesToDataSet(entries);
    if (onSave) {
      onSave(dataSet);
    }
  }, []);

  const handleBeforeChange = useCallback((changes: Handsontable.CellChange[], source: Handsontable.ChangeSource) => {
    if (changes && source === 'edit') {
      for (const change of changes) {
        const [, , , newValue] = change;
        change[3] = replaceNewLines(newValue, ' ');
      }
    }
  }, []);

  return (
    <form
      {...otherProps}
      className={
        classNames(
          className,
          styles.dataSetEditor
        )
      }
      onSubmit={handleSubmit}
    >
      <HotTable
        data={entries}
        settings={settings}
        beforeChange={handleBeforeChange}
      />
    </form>
  );
};

DataSetEditor.displayName = 'DataSetEditor';

export default DataSetEditor;
