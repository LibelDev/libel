import classNames from 'classnames';
import debugFactory from 'debug';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import * as TEXTS from '../../../constants/texts';
import type { ILabelsGroupItem } from '../../../helpers/dataSetEditor';
import { getShareURL } from '../../../helpers/label';
import { mapValidationError } from '../../../helpers/validation';
import type { ILabel } from '../../../models/Label';
import schema from '../../../schemas/label';
import Icon from '../../Icon/Icon';
import { IconName } from '../../Icon/types';
import IconButton from '../../IconButton/IconButton';
import LabelSourceButton from '../../LabelSourceButton/LabelSourceButton';
import TextInput from '../../TextInput/TextInput';
import styles from './UserLabelsEditor.module.scss';

export interface IError {
  [name: string]: boolean | undefined;
}

export interface IProps {
  user: string;
  items: ILabelsGroupItem[];
  autoScrollLabelIndex?: number;
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
   * fire when `autoScrollLabelIndex` changed and successfully scroll to target label
   * @param {HTMLLIElement} target the target element that scrolled into view
   */
  onScroll: (target: HTMLLIElement) => void;
}

type TComponentProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'onScroll'>;

type TProps = IProps & TComponentProps;

const debug = debugFactory('libel:component:DataSetEditor:UserLabelsEditor');

const UserLabelsEditor: React.FunctionComponent<TProps> = React.memo((props) => {
  const { user, items, autoScrollLabelIndex = -1, onChange, onRemove, onScroll } = props;

  const errors = useMemo(() => {
    return items.map<IError>((item) => {
      const [, draft] = item;
      const { error } = schema.validate(draft);
      const _error = mapValidationError<IError>(error, (error, key) => {
        error[key!] = true;
        return error;
      }, {});
      return _error;
    });
  }, [items]);

  const listRef = useRef<HTMLOListElement>(null);

  const userProfileURL = `/profile/${user}`;

  const handleTextInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
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
  }, [user, items, onRemove]);

  useEffect(() => {
    if (autoScrollLabelIndex >= 0) {
      if (listRef.current) {
        const listItems = listRef.current.querySelectorAll('li');
        const listItem = listItems[autoScrollLabelIndex];
        if (listItem) {
          listItem.scrollIntoView({ behavior: 'smooth' });
          onScroll(listItem);
        }
      }
    }
  }, [autoScrollLabelIndex, onScroll]);

  return (
    <React.Fragment>
      <div className={styles.user}>
        <Icon icon={IconName.Account} />
        <a className={styles.link} href={userProfileURL} target='_blank'>
          {user}
        </a>
      </div>
      <ol ref={listRef} className={styles.labelList}>
        {
          items.map(([, draft, removed], index) => (
            <li key={index}>
              <IconButton
                className={styles.remove}
                value={index}
                icon={removed ? IconName.DeleteForever : IconName.Delete}
                aria-label={TEXTS.BUTTON_TEXT_REMOVE_LABEL}
                onClick={handleRemoveButtonClick}
              />
              <TextInput
                className={classNames(styles.textInput, styles.text)}
                name='text'
                value={draft.text}
                data-index={index}
                disabled={removed}
                invalid={errors[index].text}
                placeholder={TEXTS.LABEL_EDITOR_FIELD_PLACEHOLDER_LABEL_TEXT}
                onChange={handleTextInputChange}
              />
              <TextInput
                className={classNames(styles.textInput, styles.reason)}
                name='reason'
                value={draft.reason || ''}
                data-index={index}
                disabled={removed}
                invalid={errors[index].reason}
                placeholder={TEXTS.LABEL_EDITOR_FIELD_PLACEHOLDER_LABEL_REASON}
                onChange={handleTextInputChange}
              />
              <LabelSourceButton
                className={classNames(styles.link, styles.source)}
                url={getShareURL(draft)}
                aria-label={TEXTS.BUTTON_TEXT_LABEL_SOURCE}
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
    </React.Fragment>
  );
});

UserLabelsEditor.displayName = 'UserLabelsEditor';

export default UserLabelsEditor;
