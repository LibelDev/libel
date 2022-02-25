import { HotTable } from '@handsontable/react';
import classNames from 'classnames';
import debugFactory from 'debug';
import Handsontable from 'handsontable';
import { registerAllModules } from 'handsontable/registry';
import React, { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import * as TEXTS from '../../constants/texts';
import { mapDataSetToCSV } from '../../helpers/spreadsheet';
import DataSet from '../../models/DataSet';
import { color, image, reason, text } from '../../schemas/label';
import ColorCell from './Cells/ColorCell';
import ImageCell from './Cells/ImageCell';
import SourceCell from './Cells/SourceCell';
import UserIDCell from './Cells/UserIDCell';
import styles from './DataSetEditor.module.scss';

interface IProps {
  dataSet: DataSet;
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
    readOnly: true,
    renderer: (hotInstance, cell, row, column, prop, color?: string | null) => {
      cell.classList.add(styles.colorCell);
      const handleChange = (color?: string | null) => {
        debug('handleChange', color);
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
    readOnly: true,
    renderer: (hotInstance, cell, row, column, prop, value, cellProperties) => {
      cell.classList.add('htCenter');
      Handsontable.renderers.TextRenderer.apply(this, [hotInstance, cell, row, column, prop, value, cellProperties]);
    }
  }
];

const settings: Handsontable.GridSettings = {
  licenseKey: process.env.HANDSONTABLE_LICENSE_KEY,
  height: 300,
  width: 800,
  columns,
  colWidths: [80, 80, 200, 50, 60, 50, 180],
  colHeaders: true,
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
  trimRows: true,
  undo: true
};

const DataSetEditor: React.FunctionComponent<TProps> = (props) => {
  const { dataSet, className, ...otherProps } = props;

  // memoize the csv to avoid changes from outside
  const csv = useMemo(() => mapDataSetToCSV(dataSet), []);
  const [colHeaders, ...data] = csv;
  debug('csv', csv);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();
    debug('handleSubmit', csv);
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
        data={data}
        settings={settings}
        colHeaders={colHeaders as string[]}
      />
    </form>
  );
};

DataSetEditor.displayName = 'DataSetEditor';

export default DataSetEditor;
