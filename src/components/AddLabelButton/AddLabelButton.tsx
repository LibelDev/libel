import { faTag } from '@fortawesome/free-solid-svg-icons/faTag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type React from 'react';
import { useCallback, useState } from 'react';
import * as TEXTS from '../../constants/texts';
import * as gtag from '../../helpers/gtag';
import { mapPostToSource } from '../../helpers/label';
import useLabelSourcePost from '../../hooks/useLabelSourcePost';
import { actions as personalActions, IAddLabelPayload } from '../../store/slices/personal';
import { useTypedDispatch } from '../../store/store';
import { EventAction, EventCategory, EventLabel } from '../../types/ga';
import IconButton from '../IconButton/IconButton';
import useLabelForm from '../LabelForm/useLabelForm';
import LabelFormModal, { TLabelFormProps } from '../LabelFormModal/LabelFormModal';
import styles from './AddLabelButton.module.scss';

interface IProps {
  user: string;
}

type TProps = IProps;

const AddLabelButton: React.FunctionComponent<TProps> = (props) => {
  const { user } = props;

  const dispatch = useTypedDispatch();
  const post = useLabelSourcePost()!;
  const [open, setOpen] = useState(false);
  const [loading, submit] = useLabelForm();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    if (!loading) {
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
    const { text, reason, color } = data;
    const image = await submit(data);
    const source = mapPostToSource(post);
    const payload: IAddLabelPayload = { user, text, reason, source, color, image };
    dispatch(personalActions.add(payload));
    handleLabelFormModalClose();
    // analytics
    gtag.event(EventAction.Add, { event_category: EventCategory.Label, event_label: text });
  }, [user, post, submit, handleLabelFormModalClose]);

  return (
    <>
      <IconButton
        className={styles.addLabelButton}
        icon={<FontAwesomeIcon icon={faTag} />}
        aria-label={TEXTS.BUTTON_TEXT_LABEL_ADD}
        data-tip={TEXTS.BUTTON_TEXT_LABEL_ADD}
        title={TEXTS.BUTTON_TEXT_LABEL_ADD}
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
    </>
  );
};

AddLabelButton.displayName = 'AddLabelButton';

export default AddLabelButton;
