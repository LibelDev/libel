import classNames from 'classnames';
import debugFactory from 'debug';
import produce from 'immer';
import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { namespace } from '../../../package.json';
import * as TEXTS from '../../constants/texts';
import { filterLabelsGroupsByKeyword, findLabelsGroupByUser, mapDataSetToLabelsGroupsGroupedByUser, mapLabelsGroupsGroupedByUserToDataSet } from '../../helpers/dataSetEditor';
import useFadeoutScroll from '../../hooks/useFadeoutScroll';
import type DataSet from '../../models/DataSet';
import type { IDataSet } from '../../models/DataSet';
import type { ILabel } from '../../models/Label';
import schema from '../../schemas/dataSet';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './DataSetEditor.module.scss';
import Filter, { IProps as IFilterProps } from './Filter/Filter';
import UserLabelsEditor, { IProps as IUserLabelsEditorProps } from './UserLabelsEditor/UserLabelsEditor';

interface IAutoScrollUserItemIndex {
  /** only scroll to one user and item */
  [user: string]: number; // item index
}

export interface IProps {
  dataSet: IDataSet;
  onChange?: (user: string, index: number, label?: ILabel) => void;
  onSubmit: (dataSet: DataSet) => void;
}

type TComponentProps = TComponentPropsWithoutRef<'form', IProps>;

export type TProps = IProps & TComponentProps;

const debug = debugFactory('libel:component:DataSetEditor');

const DataSetEditor: React.FunctionComponent<TProps> = (props) => {
  const { className, dataSet, onChange, onSubmit, ...otherProps } = props;

  const [keyword, setKeyword] = useState('');
  const [labelsGroups, setLabelsGroups] = useState(mapDataSetToLabelsGroupsGroupedByUser(dataSet));
  const filteredLabelsGroups = useMemo(() => filterLabelsGroupsByKeyword(labelsGroups, keyword), [labelsGroups, keyword]);
  const [autoScrollUserItemIndex, setAutoScrollUserItemIndex] = useState<IAutoScrollUserItemIndex>();
  const [error, setError] = useState<string | null>(null);
  const [innerRef, fadeoutScrollStyle] = useFadeoutScroll<HTMLDivElement>({ fadingRate: 0.3 });

  const name = `${namespace}-${DataSetEditor.displayName!}`;

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
  }, [onChange, labelsGroups, filteredLabelsGroups]);

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
      if (onChange) {
        onChange(user, itemIndex);
      }
    }
  }, [onChange, labelsGroups, filteredLabelsGroups]);

  const handleUserLabelsScroll: IUserLabelsEditorProps['onScroll'] = useCallback(() => {
    // allow scrolling to the same label again
    setAutoScrollUserItemIndex(undefined);
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();
    const dataSet = mapLabelsGroupsGroupedByUserToDataSet(labelsGroups);
    debug('handleSubmit:dataSet', dataSet);
    const { error } = schema.validate(dataSet);
    if (error) {
      setError(TEXTS.DATA_SET_EDITOR_ERROR_INVALID);
      debug('handleSubmit:error', error);
      const { details } = error;
      const { path } = details[0];
      const [, user, labelIndex] = path;
      const _user = user as string;
      const _labelIndex = labelIndex as number;
      setAutoScrollUserItemIndex({ [_user]: _labelIndex });
    } else {
      setError(null);
      onSubmit(dataSet);
    }
  }, [onSubmit, labelsGroups]);

  return (
    <form
      {...otherProps}
      name={name}
      className={
        classNames(
          className,
          styles.dataSetEditor
        )
      }
      onSubmit={handleSubmit}
    >
      <Filter
        autoFocus
        value={keyword}
        placeholder={TEXTS.DATA_SET_EDITOR_FILTER_PLACEHOLDER}
        onChange={handleFilterChange}
      />
      <div ref={innerRef} className={styles.inner} style={fadeoutScrollStyle}>
        {
          filteredLabelsGroups.length > 0 ? (
            <ol className={styles.labelsGroupList}>
              {
                filteredLabelsGroups.map(({ user, items }, index) => (
                  <li key={user}>
                    <UserLabelsEditor
                      className={styles.userLabelsEditor}
                      user={user}
                      items={items}
                      autoScrollItemIndex={autoScrollUserItemIndex && autoScrollUserItemIndex[user]}
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
    </form>
  );
};

DataSetEditor.displayName = 'DataSetEditor';

export default DataSetEditor;
