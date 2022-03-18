// import debugFactory from 'debug';
import Handsontable from 'handsontable';
import { AutocompleteCellType, registerCellType, TextCellType } from 'handsontable/cellTypes';
import { CopyPaste, DropdownMenu, Filters, registerPlugin, UndoRedo } from 'handsontable/plugins';
import React from 'react';
import ReactDOM from 'react-dom';
import * as TEXTS from '../../constants/texts';
import { image, reason, text } from '../../schemas/label';
import ImageCell from './Cells/ImageCell';
import SourceCell from './Cells/SourceCell';
import UserIDCell from './Cells/UserIDCell';

// const debug = debugFactory('libel:component:DataSetEditor:config');

// register cell types and plugins
registerCellType(AutocompleteCellType);
registerCellType(TextCellType);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(UndoRedo);

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
    type: 'autocomplete',
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
  // /**
  //  * color
  //  */
  // {
  //   type: 'text',
  //   data: 'label.color',
  //   readOnly: true,
  //   renderer: (hotInstance, cell, row, column, prop, color?: string | null) => {
  //     cell.classList.add(colorCellStyles.colorCell);
  //     const handleChange = (color: string | null) => {
  //       hotInstance.setDataAtCell(row, column, color);
  //     };
  //     ReactDOM.render(<ColorCell color={color} onChange={handleChange} />, cell);
  //   },
  //   validator: (value, callback) => {
  //     const { error } = color.allow(null).validate(value);
  //     callback(!error);
  //   }
  // },
  /**
   * image
   */
  {
    type: 'text',
    data: 'label.image',
    placeholder: TEXTS.SPREADSHEET_COLUMN_PLACEHOLDER_LABEL_IMAGE,
    renderer: function (hotInstance, cell, row, column, prop, src: string | null | undefined, cellProperties) {
      cell.classList.add('htCenter');
      if (!src) {
        cell.classList.add('htDimmed');
      }
      ReactDOM.render(<ImageCell src={src} placeholder={cellProperties.placeholder} />, cell);
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
    data: 'label.shareURL',
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
  // TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_COLOR,
  TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_IMAGE,
  TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_SOURCE,
  TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_DATE
];

export const settings: Handsontable.GridSettings = {
  licenseKey: process.env.HANDSONTABLE_LICENSE_KEY,
  height: 300,
  width: 800,
  columns,
  colWidths: [80, 80, 240, /* 50, */ 60, 50, 150],
  colHeaders,
  rowHeaders: false,
  selectionMode: 'single',
  stretchH: 'all',
  allowInvalid: false,
  wordWrap: false,
  // plugins
  copyPaste: true,
  dropdownMenu: false,
  filters: false,
  undo: true
};
