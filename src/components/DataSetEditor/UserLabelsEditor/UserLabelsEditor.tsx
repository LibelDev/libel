import classNames from 'classnames';
// import debugFactory from 'debug';
import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Key } from 'ts-key-enum';
import * as TEXTS from '../../../constants/texts';
import { getElementLabelTipProps } from '../../../helpers/common';
import { ILabelsGroupItem, mapLabelsGroupItemsToErrorStates } from '../../../helpers/dataSetEditor';
import { getShareURL } from '../../../helpers/label';
import useVisibility, { UseVisibility } from '../../../hooks/useVisibility';
import type { ILabel } from '../../../models/Label';
import ColorPicker from '../../ColorPicker/ColorPicker';
import Icon from '../../Icon/Icon';
import { IconName } from '../../Icon/types';
import IconButton from '../../IconButton/IconButton';
import LabelSourceButton from '../../LabelSourceButton/LabelSourceButton';
import TextInput from '../../TextInput/TextInput';
import Loading from './Loading';
import styles from './UserLabelsEditor.module.scss';

export interface IProps {
  user: string;
  items: ILabelsGroupItem[];
  autoScrollItemIndex?: number;
  /**
   * change event handler
   * @param {string} user the grouped user ID
   * @param {number} index the index of the item in the filtered array
   * @param {ILabel} label the new label
   */
  onChange: (user: string, index: number, label: ILabel) => void;
  /**
   * remove event handler
   * @param {string} user the grouped user ID
   * @param {number} index the index of the item in the filtered array
   */
  onRemove: (user: string, index: number) => void;
  /**
   * custom scroll event handler
   * fire when `autoScrollItemIndex` changed and successfully scroll to target label
   * @param {HTMLLIElement} target the target element that scrolled into view
   */
  onScroll: (target: HTMLLIElement) => void;
}

type TComponentProps = TComponentPropsWithoutRef<'div', IProps>;

type TProps = IProps & TComponentProps;

// const debug = debugFactory('libel:component:DataSetEditor:UserLabelsEditor');

const UserLabelsEditor: React.FunctionComponent<TProps> = memo((props) => {
  const { className, user, items, autoScrollItemIndex = -1, onChange, onRemove, onScroll } = props;

  const userProfileURL = `/profile/${user}`;

  /** validation error for each item */
  const errors = useMemo(() => mapLabelsGroupItemsToErrorStates(items), [items]);

  const [style, setStyle] = useState<React.CSSProperties>({});

  /** lazy rendering */
  const handleBeforeVisibilityChange: UseVisibility.TBeforeChangeEventHandler<HTMLDivElement> = useCallback((element, visible) => {
    if (visible) {
      setStyle({});
    } else {
      // occupy the space when invisible
      const { height } = element.getBoundingClientRect();
      setStyle({ height });
    }
  }, []);
  const [ref, visible] = useVisibility({ beforeChange: handleBeforeVisibilityChange });

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { name, value } = event.currentTarget;
    const { index } = event.currentTarget.dataset;
    const _index = parseInt(index!); // the index of the item in the filtered array
    const [, draft] = items[_index];
    const label: ILabel = { ...draft, [name]: value };
    onChange(user, _index, label);
  }, [user, items, onChange]);

  const handleRemoveButtonClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const { value } = event.currentTarget;
    const index = parseInt(value); // the index of the item in the filtered array
    onRemove(user, index);
  }, [user, onRemove]);

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
    const { key } = event;
    if (key === Key.Enter) {
      event.preventDefault();
    }
  }, []);

  /** auto scroll to the item  */
  useEffect(() => {
    if (autoScrollItemIndex >= 0) {
      if (ref.current) {
        const listItems = ref.current.querySelectorAll('li');
        const listItem = listItems[autoScrollItemIndex];
        const options: ScrollIntoViewOptions = { behavior: 'smooth' };
        if (listItem) {
          listItem.scrollIntoView(options);
          onScroll(listItem);
        } else {
          ref.current.scrollIntoView(options);
        }
      }
    }
  }, [autoScrollItemIndex, onScroll, visible]);

  return (
    <div ref={ref} className={classNames(className, styles.userLabelsEditor)} style={style}>
      {
        visible ? (
          <>
            <div className={styles.user}>
              <Icon icon={IconName.Account} />
              <a className={styles.link} href={userProfileURL} target="_blank">
                {user}
              </a>
            </div>
            <ol className={styles.labelList}>
              {
                items.map(([original, draft, removed], index) => (
                  <li key={original.id}>
                    <IconButton
                      className={styles.remove}
                      value={index}
                      icon={removed ? IconName.DeleteForever : IconName.Delete}
                      {...getElementLabelTipProps(TEXTS.BUTTON_TEXT_LABEL_REMOVE)}
                      onClick={handleRemoveButtonClick}
                    />
                    <TextInput
                      className={classNames(styles.inputField, styles.text)}
                      name="text"
                      value={draft.text}
                      data-index={index}
                      disabled={removed}
                      invalid={errors[index].text}
                      placeholder={TEXTS.LABEL_EDITOR_FIELD_PLACEHOLDER_LABEL_TEXT}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                    />
                    <TextInput
                      className={classNames(styles.inputField, styles.reason)}
                      name="reason"
                      value={draft.reason || ''}
                      data-index={index}
                      disabled={removed}
                      invalid={errors[index].reason}
                      placeholder={TEXTS.LABEL_EDITOR_FIELD_PLACEHOLDER_LABEL_REASON}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                    />
                    <ColorPicker
                      border
                      rounded
                      className={styles.inputField}
                      name="color"
                      value={draft.color || ''}
                      data-index={index}
                      disabled={removed}
                      onChange={handleInputChange}
                    />
                    <LabelSourceButton
                      className={classNames(styles.link, styles.source)}
                      url={getShareURL(draft)}
                      {...getElementLabelTipProps(TEXTS.BUTTON_TEXT_LABEL_SOURCE)}
                    />
                    {
                      removed && (
                        <div className={styles.hint}>
                          {TEXTS.LABEL_EDITOR_LABEL_ITEM_HINT_TEXT_REMOVE}
                        </div>
                      )
                    }
                  </li>
                ))
              }
            </ol>
          </>
        ) : (
          <Loading />
        )
      }
    </div>
  );
});

UserLabelsEditor.displayName = 'UserLabelsEditor';

export default UserLabelsEditor;
