import debugFactory from 'debug';
import type React from 'react';
import { useCallback, useState } from 'react';
import * as TEXTS from '../../../constants/texts';
import * as LIHKG from '../../../helpers/lihkg';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { selectPersonal } from '../../../store/selectors';
import { actions as personalActions } from '../../../store/slices/personal';
import { useTypedDispatch, useTypedSelector } from '../../../store/store';
import type { IProps as IDataSetEditorProps } from '../../DataSetEditor/DataSetEditor';
import DataSetEditorModal from '../../DataSetEditorModal/DataSetEditorModal';
import SettingOptionButton from '../SettingOptionButton/SettingOptionButton';

const debug = debugFactory('libel:component:EditDataSetButton');

const EditDataSetButton: React.FunctionComponent = () => {
  const dispatch = useTypedDispatch();
  const personal = useTypedSelector(selectPersonal);
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const focusTrap = useFocusTrap();

  const handleOpen = useCallback(() => {
    setDirty(false);
    focusTrap?.pause();
    window.requestAnimationFrame(() => {
      setOpen(true);
    });
  }, [focusTrap]);

  const handleClose = useCallback((prudent = true) => {
    if (prudent && dirty) {
      const users = Object.keys(personal.data); // empty data set
      if (users.length > 0) {
        const yes = window.confirm(TEXTS.DATA_SET_EDITOR_MESSAGE_CLOSE_CONFIRMATION);
        if (!yes) {
          return;
        }
      }
    }
    focusTrap?.unpause();
    window.requestAnimationFrame(() => {
      setOpen(false);
    });
  }, [personal, dirty, focusTrap]);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
    event.preventDefault();
    const users = Object.keys(personal.data);
    if (users.length > 0) {
      handleOpen();
    } else {
      const notification = LIHKG.createLocalNotification(TEXTS.DATA_SET_EDITOR_MESSAGE_EMPTY_DATA_SET);
      LIHKG.showNotification(notification);
    }
  }, [personal, handleOpen]);

  const handleChange: IDataSetEditorProps['onChange'] = useCallback(() => {
    setDirty(true);
  }, []);

  const handleSubmit: IDataSetEditorProps['onSubmit'] = useCallback((dataSet) => {
    const confirmed = window.confirm(TEXTS.DATA_SET_EDITOR_MESSAGE_SAVE_CONFIRMATION);
    if (confirmed) {
      debug('handleDataSetEditorSubmit', dataSet);
      dispatch(personalActions.update(dataSet));
      handleClose(false);
      const notification = LIHKG.createLocalNotification(TEXTS.DATA_SET_EDITOR_MESSAGE_SAVE_SUCCESS);
      LIHKG.showNotification(notification);
    }
  }, [focusTrap, handleClose]);

  return (
    <>
      <SettingOptionButton onClick={handleClick}>
        {TEXTS.BUTTON_TEXT_EDIT_DATA_SET}
      </SettingOptionButton>
      <DataSetEditorModal
        dataSet={personal}
        onChange={handleChange}
        onSubmit={handleSubmit}
        open={open}
        escape={false}
        fragile={false}
        onClose={handleClose}
      />
    </>
  );
};

EditDataSetButton.displayName = 'EditDataSetButton';

export default EditDataSetButton;
