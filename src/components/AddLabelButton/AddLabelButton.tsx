import React, { useCallback, useState } from 'react';
import { uploadImage } from '../../apis/nacx';
import * as TEXTS from '../../constants/texts';
import { mapPostToSource } from '../../helpers/label';
import { actions as personalActions, IAddLabelPayload } from '../../store/slices/personal';
import { useTypedDispatch } from '../../store/store';
import { IPost } from '../../types/lihkg';
import Button from '../Button/Button';
import LabelFormModal, { TLabelFormProps } from '../LabelFormModal/LabelFormModal';
import styles from './AddLabelButton.scss';

interface IProps {
  user: string;
  targetReply: IPost;
}

const AddLabelButton: React.FunctionComponent<IProps> = (props) => {
  const { user, targetReply, children } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useTypedDispatch();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    if (!loading) {
      setOpen(true);
    }
  }, [loading]);

  const handleModalClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLabelFormSubmit: TLabelFormProps['onSubmission'] = useCallback(async (event, data) => {
    const { text, reason, color, image, meta } = data;
    const source = mapPostToSource(targetReply);
    const payload: IAddLabelPayload = { user, text, reason, color, image, source };
    setLoading(true);
    const { screenshot } = meta;
    if (screenshot) {
      try {
        const { status, url } = await uploadImage(screenshot);
        switch (status) {
          case 200: {
            payload.image = url;
            dispatch(personalActions.add(payload));
            handleModalClose();
            break;
          }
          default: {
            throw TEXTS.LABEL_FORM_FIELD_ERROR_CAPTURE_FAILURE;
          }
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
        if (typeof err === 'string') {
          throw err;
        } else {
          throw TEXTS.LABEL_FORM_FIELD_ERROR_CAPTURE_FAILURE;
        }
      }
    } else {
      dispatch(personalActions.add(payload));
    }
    setLoading(false);
    handleModalClose();
  }, [user, targetReply, handleModalClose]);

  return (
    <React.Fragment>
      <Button
        className={styles.addLabelButton}
        loading={loading}
        onClick={handleClick}
      >
        {children}
      </Button>
      <LabelFormModal
        open={open}
        user={user}
        escape={false}
        fragile={false}
        loading={loading}
        onClose={handleModalClose}
        onSubmission={handleLabelFormSubmit}
      />
    </React.Fragment>
  );
};

export default AddLabelButton;
