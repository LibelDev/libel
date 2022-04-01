import classNames from 'classnames';
import debugFactory from 'debug';
import produce from 'immer';
import React, { useCallback, useMemo, useState } from 'react';
import * as TEXTS from '../../constants/texts';
import { filterLabelsGroupsByKeyword, findLabelsGroupByUser, mapDataSetToLabelsGroupsGroupedByUser, mapLabelsGroupsGroupedByUserToDataSet } from '../../helpers/dataSetEditor';
import type { IDataSet } from '../../models/DataSet';
import type { ILabel } from '../../models/Label';
import type Personal from '../../models/Personal';
import schema from '../../schemas/dataSet';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './DataSetEditor.module.scss';
import Filter, { IProps as IFilterProps } from './Filter/Filter';
import UserLabelsEditor, { IProps as IUserLabelsEditorProps } from './UserLabelsEditor/UserLabelsEditor';

interface IAutoScrollUserLabelIndex {
  /** only scroll to one user and label */
  [user: string]: number; // label index
}

interface IProps {
  dataSet: IDataSet;
  onChange?: TBivarianceHack<(user: string, index: number, label: ILabel) => void>;
  onSubmit: TBivarianceHack<(dataSet: Personal) => void>;
}

export type TProps = IProps & Omit<React.ComponentPropsWithoutRef<'form'>, 'onChange' | 'onSubmit'>;

const debug = debugFactory('libel:component:DataSetEditor');

const DataSetEditor: React.FunctionComponent<TProps> = (props) => {
  const { className, dataSet, onChange, onSubmit, ...otherProps } = props;

  const [keyword, setKeyword] = useState('');
  const [labelsGroups, setLabelsGroups] = useState(mapDataSetToLabelsGroupsGroupedByUser(dataSet));
  const filteredLabelsGroups = useMemo(() => filterLabelsGroupsByKeyword(labelsGroups, keyword), [labelsGroups, keyword]);
  const [autoScrollUserLabelIndex, setAutoScrollUserLabelIndex] = useState<IAutoScrollUserLabelIndex>();
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange: IFilterProps['onChange'] = useCallback((keyword) => {
    setKeyword(keyword);
  }, []);

  const handleUserLabelsChange: IUserLabelsEditorProps['onChange'] = useCallback((user, index, label) => {
    const [labelsGroupIndex, labelsGroup] = findLabelsGroupByUser(labelsGroups, user);
    if (labelsGroup) {
      const { items } = labelsGroup;
      const [, filteredLabelsGroup] = findLabelsGroupByUser(filteredLabelsGroups, user);
      const filteredLabelsGroupItem = filteredLabelsGroup?.items[index];
      const itemIndex = items.findIndex((item) => item === filteredLabelsGroupItem);
      const _labelsGroups = produce(labelsGroups, (labelsGroups) => {
        const labelsGroup = labelsGroups[labelsGroupIndex];
        const { items } = labelsGroup;
        const item = items[itemIndex];
        // update the draft
        item[1] = label;
      });
      setLabelsGroups(_labelsGroups);
      if (onChange) {
        onChange(user, itemIndex, label);
      }
    }
  }, [labelsGroups, filteredLabelsGroups]);

  const handleUserLabelsRemove: IUserLabelsEditorProps['onRemove'] = useCallback((user, index) => {
    const [labelsGroupIndex, labelsGroup] = findLabelsGroupByUser(labelsGroups, user);
    if (labelsGroup) {
      const { items } = labelsGroup;
      const [, filteredLabelsGroup] = findLabelsGroupByUser(filteredLabelsGroups, user);
      const filteredLabelsGroupItem = filteredLabelsGroup?.items[index];
      const itemIndex = items.findIndex((item) => item === filteredLabelsGroupItem);
      const _labelsGroups = produce(labelsGroups, (labelsGroups) => {
        const labelsGroup = labelsGroups[labelsGroupIndex];
        const { items } = labelsGroup;
        const item = items[itemIndex];
        // toggle the `removed` flag
        item[2] = !item[2];
      });
      setLabelsGroups(_labelsGroups);
    }
  }, [labelsGroups, filteredLabelsGroups]);

  const handleUserLabelsScroll: IUserLabelsEditorProps['onScroll'] = useCallback(() => {
    // allow scrolling to the same label again
    setAutoScrollUserLabelIndex(undefined);
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();
    const dataSet = mapLabelsGroupsGroupedByUserToDataSet(labelsGroups);
    debug('handleSubmit:dataSet', dataSet);
    const { error } = schema.validate(dataSet);
    if (error) {
      setError(TEXTS.DATA_SET_EDITOR_ERROR_INVALID_LABEL);
      debug('handleSubmit:error', error);
      const { details } = error;
      const { path } = details[0];
      const [, user, labelIndex] = path;
      const _user = user as string;
      const _labelIndex = labelIndex as number;
      setAutoScrollUserLabelIndex({ [_user]: _labelIndex });
    } else {
      setError(null);
      onSubmit(dataSet);
    }
  }, [onSubmit, labelsGroups]);

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
      {
        labelsGroups.length > 0 ? (
          <React.Fragment>
            <Filter
              autoFocus
              value={keyword}
              placeholder={TEXTS.DATA_SET_EDITOR_FILTER_PLACEHOLDER}
              onChange={handleFilterChange}
            />
            <div className={styles.filterResult}>
              {
                filteredLabelsGroups.length > 0 ? (
                  <ol className={styles.labelsGroupList}>
                    {
                      filteredLabelsGroups.map(({ user, items }, index) => (
                        <li key={user}>
                          <UserLabelsEditor
                            user={user}
                            items={items}
                            autoScrollLabelIndex={autoScrollUserLabelIndex && autoScrollUserLabelIndex[user]}
                            onChange={handleUserLabelsChange}
                            onRemove={handleUserLabelsRemove}
                            onScroll={handleUserLabelsScroll}
                          />
                        </li>
                      ))
                    }
                  </ol>
                ) : (
                  TEXTS.DATA_SET_EDITOR_FILTER_MESSAGE_EMPTY_RESULT
                )
              }
            </div>
            {
              !!error && (
                <ErrorMessage className={styles.error}>
                  {error}
                </ErrorMessage>
              )
            }
          </React.Fragment>
        ) : (
          TEXTS.DATA_SET_EDITOR_MESSAGE_EMPTY_DATA_SET
        )
      }
    </form>
  );
};

DataSetEditor.displayName = 'DataSetEditor';

export default DataSetEditor;
