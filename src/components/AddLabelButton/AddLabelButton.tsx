import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadImage } from '../../apis/nacx';
import cache from '../../cache';
import * as TEXTS from '../../constants/texts';
import { toBlob } from '../../helpers/canvas';
import { mapPostToSource } from '../../helpers/label';
import { actions as personalActions, IAddLabelPayload } from '../../store/slices/personal';
import { IPost } from '../../types/post';
import Button from '../Button/Button';
import LabelFormModal, { ILabelFormProps } from '../LabelFormModal/LabelFormModal';
import styles from './AddLabelButton.scss';

interface IProps {
  user: string;
  targetReply: IPost;
}

const AddLabelButton: React.FunctionComponent<IProps> = (props) => {
  const { user, targetReply, children } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    if (!loading) {
      setOpen(true);
    }
  }, [loading]);

  const handleModalClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLabelFormSubmit: ILabelFormProps['onSubmission'] = async (event, label, capture) => {
    const source = mapPostToSource(targetReply);
    const payload: IAddLabelPayload = { user, ...label, source };
    setLoading(true);
    if (capture) {
      try {
        const image = await toBlob(cache.targetReply!);
        if (image) {
          const { status, url } = await uploadImage(image);
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
        } else {
          throw TEXTS.LABEL_FORM_FIELD_ERROR_CAPTURE_FAILURE;
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
  };

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
