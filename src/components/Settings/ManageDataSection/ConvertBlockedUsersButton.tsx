import debugFactory from 'debug';
import { render } from 'mustache';
import type React from 'react';
import { useCallback, useState } from 'react';
import { fetchBlockedUser } from '../../../apis/lihkg';
import * as TEXTS from '../../../constants/texts';
import { getErrorMessage } from '../../../helpers/error';
import * as LIHKG from '../../../helpers/lihkg';
import { mergeDataSet } from '../../../helpers/merge';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { IDataSet } from '../../../models/DataSet';
import { selectPersonal } from '../../../store/selectors';
import { actions as personalActions } from '../../../store/slices/personal';
import { useTypedDispatch, useTypedSelector } from '../../../store/store';
import * as questions from '../../../templates/questions';
import type { IProps as IDataSetEditorProps } from '../../DataSetEditor/DataSetEditor';
import DataSetEditorModal from '../../DataSetEditorModal/DataSetEditorModal';
import { IconName } from '../../Icon/types';
import IconMessage from '../../IconMessage/IconMessage';
import SettingOptionButton from '../SettingOptionButton/SettingOptionButton';

const debug = debugFactory('libel:component:ConvertBlockedUsersButton');

const ConvertBlockedUsersButton: React.FunctionComponent = () => {
  const dispatch = useTypedDispatch();
  const personal = useTypedSelector(selectPersonal);
  const [loading, setLoading] = useState(false);
  const [dataSet, setDataSet] = useState<IDataSet>();
  const [open, setOpen] = useState(false);
  const focusTrap = useFocusTrap();

  const handleOpen = useCallback(() => {
    focusTrap?.pause();
    window.requestAnimationFrame(() => {
      setOpen(true);
    });
  }, [focusTrap]);

  const handleClose = useCallback((prudent = true) => {
    if (prudent) {
      const yes = window.confirm(TEXTS.DATA_SET_EDITOR_MESSAGE_CLOSE_CONFIRMATION);
      if (!yes) {
        return;
      }
    }
    focusTrap?.unpause();
    window.requestAnimationFrame(() => {
      setOpen(false);
    });
  }, [focusTrap]);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const responseBody = await fetchBlockedUser();
      if (responseBody.success === 1 && 'response' in responseBody) {
        const { response } = responseBody;
        const { blocked_user_list: blockedUsers } = response;
        if (blockedUsers.length > 0) {
          const dataSet = LIHKG.mapBlockedUsersToDataSet(blockedUsers);
          setDataSet(dataSet);
          handleOpen();
        } else {
          throw TEXTS.CONVERT_BLOCKED_USERS_MESSAGE_NO_BLOCKED_USERS;
        }
      } else {
        if ('error_message' in responseBody) {
          throw responseBody.error_message;
        }
        throw TEXTS.CONVERT_BLOCKED_USERS_ERROR_FAILED_TO_FETCH_BLOCKED_USERS;
      }
    } catch (err) {
      debug('handleClick:err', err);
      const defaultErrorMessage = err instanceof TypeError ?
        TEXTS.CONVERT_BLOCKED_USERS_ERROR_FAILED_TO_FETCH_BLOCKED_USERS :
        TEXTS.CONVERT_BLOCKED_USERS_ERROR_GENERIC_ERROR;
      const message = getErrorMessage(err, defaultErrorMessage);
      const notification = LIHKG.createLocalNotification(message);
      LIHKG.showNotification(notification);
    }
    setLoading(false);
  }, [handleOpen]);

  const handleSubmit: IDataSetEditorProps['onSubmit'] = useCallback((dataSet) => {
    const users = Object.keys(dataSet.data);
    const message = render(questions.convert.merge, { users });
    const yes = window.confirm(message);
    if (yes) {
      const _dataSet = mergeDataSet(personal, dataSet, false);
      dispatch(personalActions.update(_dataSet));
      handleClose(false);
    }
  }, [focusTrap, handleClose]);

  return (
    <>
      <SettingOptionButton loading={loading} onClick={handleClick}>
        {TEXTS.BUTTON_TEXT_CONVERT_BLOCKED_USERS}
      </SettingOptionButton>
      {
        dataSet && (
          <DataSetEditorModal
            dataSet={dataSet}
            onSubmit={handleSubmit}
            open={open}
            escape={false}
            fragile={false}
            onClose={handleClose}
          >
            <IconMessage icon={IconName.Bell}>
              {TEXTS.CONVERT_BLOCKED_USERS_HINT_TEXT_UNBLOCK}
            </IconMessage>
          </DataSetEditorModal>
        )
      }
    </>
  );
};

ConvertBlockedUsersButton.displayName = 'ConvertBlockedUsersButton';

export default ConvertBlockedUsersButton;
