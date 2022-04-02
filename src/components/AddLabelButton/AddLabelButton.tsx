import { faTag } from '@fortawesome/free-solid-svg-icons/faTag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useState } from 'react';
import { uploadImage } from '../../apis/nacx';
import cache from '../../cache';
import * as ATTRIBUTES from '../../constants/attributes';
import { EventAction, EventCategory, EventLabel } from '../../constants/ga';
import * as TEXTS from '../../constants/texts';
import * as gtag from '../../helpers/gtag';
import { mapPostToSource } from '../../helpers/label';
import { actions as personalActions, IAddLabelPayload } from '../../store/slices/personal';
import { useTypedDispatch } from '../../store/store';
import type { IPost } from '../../types/lihkg';
import IconButton from '../IconButton/IconButton';
import LabelFormModal, { TLabelFormProps } from '../LabelFormModal/LabelFormModal';
import styles from './AddLabelButton.module.scss';

interface IProps {
  user: string;
  post: IPost;
}

type TProps = IProps;

const AddLabelButton: React.FunctionComponent<TProps> = (props) => {
  const { user, post } = props;

  const dispatch = useTypedDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    if (!loading) {
      const targetReply = document.querySelector<HTMLDivElement>(ATTRIBUTES.dataPostId);
      cache.targetReply = targetReply;
      setOpen(true);
      // analytics
      gtag.event(EventAction.Open, { event_category: EventCategory.Modal, event_label: EventLabel.AddLabel });
    }
  }, [loading]);

  const handleLabelFormModalClose = useCallback(() => {
    setOpen(false);
    // analytics
    gtag.event(EventAction.Close, { event_category: EventCategory.Modal, event_label: EventLabel.AddLabel });
  }, []);

  const handleLabelFormSubmit: TLabelFormProps['onSubmit'] = useCallback(async (data) => {
    const { text, reason, color, image, meta } = data;
    const source = mapPostToSource(post);
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
            break;
          }
          default: {
            throw TEXTS.LABEL_FORM_FIELD_ERROR_FAILED_TO_UPLOAD;
          }
        }
      } catch (err) {
        console.error(err);
        if (typeof err === 'string') {
          throw err;
        } else {
          throw TEXTS.LABEL_FORM_FIELD_ERROR_FAILED_TO_UPLOAD;
        }
      }
    } else {
      dispatch(personalActions.add(payload));
    }
    setLoading(false);
    handleLabelFormModalClose();
    // analytics
    gtag.event(EventAction.Add, { event_category: EventCategory.Label, event_label: text });
  }, [user, post, handleLabelFormModalClose]);

  return (
    <React.Fragment>
      <IconButton
        className={styles.addLabelButton}
        icon={<FontAwesomeIcon icon={faTag} />}
        aria-label={TEXTS.BUTTON_TEXT_ADD_LABEL}
        data-tip={TEXTS.BUTTON_TEXT_ADD_LABEL}
        title={TEXTS.BUTTON_TEXT_ADD_LABEL}
        disabled={loading}
        onClick={handleClick}
      />
      <LabelFormModal
        open={open}
        user={user}
        escape={false}
        fragile={false}
        loading={loading}
        onClose={handleLabelFormModalClose}
        onSubmit={handleLabelFormSubmit}
      />
    </React.Fragment>
  );
};

export default AddLabelButton;
