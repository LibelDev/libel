// import { HotTable } from '@handsontable/react';
import classNames from 'classnames';
import debugFactory from 'debug';
import Handsontable from 'handsontable';
import produce from 'immer';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { deduplicate } from '../../helpers/array';
import { mapDataSetToSpreadsheetEntries, mapSpreadsheetEntriesToDataSet } from '../../helpers/spreadsheet';
import { replaceNewLines } from '../../helpers/string';
import { IDataSet } from '../../models/DataSet';
import Personal from '../../models/Personal';
import { settings } from './config';
import styles from './DataSetEditor.module.scss';

interface IProps {
  dataSet: IDataSet;
  onChange?: (changes: Handsontable.CellChange[]) => void;
  onSubmit?: (dataSet: Personal) => void;
}

export type TProps = IProps & Omit<React.ComponentPropsWithoutRef<'form'>, 'onChange' | 'onSubmit'>;

type TCellChange = [
  number,
  string | number,
  string | null,
  string | null
];

const debug = debugFactory('libel:component:DataSetEditor');

const DataSetEditor: React.FunctionComponent<TProps> = (props) => {
  const { dataSet, className, onChange, onSubmit, ...otherProps } = props;

  const [hotInstance, setHotInstance] = useState<Handsontable | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // memoize the data to avoid changes from outside
  const entries = useMemo(() => mapDataSetToSpreadsheetEntries(dataSet), []);
  debug('entries', entries);
  const _settings = useMemo(() => {
    return produce(settings, (settings) => {
      const texts = entries.map(({ label }) => label.text);
      const [, textColumn] = settings.columns as Handsontable.ColumnSettings[];
      textColumn.source = deduplicate(texts);
    });
  }, [entries]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();
    if (onSubmit) {
      const dataSet = mapSpreadsheetEntriesToDataSet(entries);
      onSubmit(dataSet);
    }
  }, [entries]);

  const handleBeforeChange = useCallback((changes: Handsontable.CellChange[], source: Handsontable.ChangeSource) => {
    if (changes && source === 'edit') {
      for (const change of changes) {
        const [, , , newValue] = change as TCellChange;
        change[3] = newValue && replaceNewLines(newValue, ' ');
      }
      if (onChange) {
        onChange(changes);
      }
    }
  }, []);

  useEffect(() => {
    if (ref.current) {
      const hotInstance = new Handsontable(ref.current, {
        ..._settings,
        data: entries,
        beforeChange: handleBeforeChange
      });
      setHotInstance(hotInstance);
    }
  }, [_settings, entries, handleBeforeChange]);

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
      <div ref={ref} />
    </form>
  );
};

DataSetEditor.displayName = 'DataSetEditor';

export default DataSetEditor;
