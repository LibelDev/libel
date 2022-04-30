import debugFactory from 'debug';
import type React from 'react';
import { useCallback, useState } from 'react';
import { fetchBlockedUser } from '../../../apis/lihkg';
import * as TEXTS from '../../../constants/texts';
import { getErrorMessage } from '../../../helpers/error';
import * as LIHKG from '../../../helpers/lihkg';
import useFocusTrap from '../../../hooks/useFocusTrap';
import { IDataSet } from '../../../models/DataSet';
import type { IProps as IDataSetEditorProps } from '../../DataSetEditor/DataSetEditor';
import DataSetEditorModal from '../../DataSetEditorModal/DataSetEditorModal';
import SettingOptionButton from '../SettingOptionButton/SettingOptionButton';

const debug = debugFactory('libel:component:ConvertBlockedUsersButton');

const ConvertBlockedUsersButton: React.FunctionComponent = () => {
  // const dispatch = useTypedDispatch();
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

  const handleClose = useCallback(() => {
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
        const dataSet = LIHKG.mapBlockedUsersToDataSet(blockedUsers);
        setDataSet(dataSet);
        handleOpen();
      } else {
        if ('error_message' in responseBody) {
          throw responseBody.error_message;
        }
        throw TEXTS.CONVERT_BLOCKED_USERS_ERROR_FAILED_TO_FETCH_BLOCKED_USERS;
      }
    } catch (err) {
      debug('handleClick', err);
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
    debug('handleSubmit', dataSet);
  }, [focusTrap]);

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
          />
        )
      }
    </>
  );
};

ConvertBlockedUsersButton.displayName = 'ConvertBlockedUsersButton';

export default ConvertBlockedUsersButton;
