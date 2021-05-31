import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadImage } from '../../apis/nacx';
import cache from '../../cache';
import * as TEXTS from '../../constants/texts';
import { toBlob } from '../../helpers/canvas';
import { promptAdd } from '../../helpers/label';
import { actions as personalActions, IAddLabelPayload } from '../../store/slices/personal';
import { IPost } from '../../types/post';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './AddLabelButton.scss';

interface IProps {
  user: string;
  targetReply: IPost;
}

const AddLabelButton: React.FunctionComponent<IProps> = (props) => {
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const { user, targetReply, children } = props;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(async (event) => {
    event.preventDefault();
    if (!disabled) {
      setDisabled(true);
      const data = promptAdd();
      if (data) {
        const { text, reason, isScreenshotEnabled } = data;
        const source = {
          thread: targetReply.thread_id,
          page: targetReply.page,
          messageNumber: targetReply.msg_num
        };
        const payload: IAddLabelPayload = { user, text, reason, source };
        if (isScreenshotEnabled) {
          try {
            const image = await toBlob(cache.targetReply!);
            if (image) {
              const { status, url } = await uploadImage(image);
              switch (status) {
                case 200: {
                  payload.image = url;
                  break;
                }
                default: {
                  throw TEXTS.ADD_LABEL_SCREENSHOT_CAPTURE_FAILURE;
                }
              }
            } else {
              throw TEXTS.ADD_LABEL_SCREENSHOT_CAPTURE_FAILURE;
            }
          } catch (err) {
            console.error(err);
            window.alert(TEXTS.ADD_LABEL_SCREENSHOT_CAPTURE_FAILURE);
          }
        }
        dispatch(personalActions.add(payload));
      }
      setDisabled(false);
    }
  }, [disabled, user, targetReply]);

  return (
    <a
      className={
        classnames(
          styles.addLabelButton,
          {
            [styles.disabled]: disabled
          }
        )
      }
      href="#"
      onClick={handleClick}
    >
      {disabled ? <LoadingSpinner /> : children}
    </a>
  );
};

export default AddLabelButton;
