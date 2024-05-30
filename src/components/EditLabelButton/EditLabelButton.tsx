import type React from 'react';
import { useCallback, useState } from 'react';
import * as TEXTS from '../../constants/texts';
import { getElementLabelTipProps } from '../../helpers/common';
import * as gtag from '../../helpers/gtag';
import type { ILabel } from '../../models/Label';
import { actions as personalActions, IEditLabelPayload } from '../../store/slices/personal';
import { useTypedDispatch } from '../../store/store';
import { EventAction, EventCategory, EventLabel } from '../../types/ga';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import useLabelForm from '../LabelForm/useLabelForm';
import LabelFormModal, { type TLabelFormProps } from '../LabelFormModal/LabelFormModal';

interface IProps {
  user: string;
  index: number;
  label: ILabel;
}

type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

type TProps = IProps & TComponentProps;

const EditLabelButton: React.FunctionComponent<TProps> = (props) => {
  const { user, index, label, ...otherProps } = props;

  const dispatch = useTypedDispatch();
  const [open, setOpen] = useState(false);
  const [loading, submit] = useLabelForm();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    setOpen(true);
    // analytics
    gtag.event(EventAction.Open, { event_category: EventCategory.Modal, event_label: EventLabel.EditLabel });
  }, []);

  const handleModalClose = useCallback(() => {
    setOpen(false);
    // analytics
    gtag.event(EventAction.Close, { event_category: EventCategory.Modal, event_label: EventLabel.EditLabel });
  }, []);

  const handleLabelFormSubmit: TLabelFormProps['onSubmit'] = useCallback(async (data) => {
    const { text, reason, color, image } = data;
    const newImage = await submit(data);
    const payload: IEditLabelPayload = { user, index, text, reason, color, image: newImage || image };
    dispatch(personalActions.edit(payload));
    handleModalClose();
    // analytics
    gtag.event(EventAction.Edit, { event_category: EventCategory.Label, event_label: text });
  }, [user, index, submit, handleModalClose]);

  return (
    <>
      <IconButton
        icon={IconName.Pencil}
        {...getElementLabelTipProps(TEXTS.BUTTON_TEXT_LABEL_EDIT)}
        onClick={handleClick}
        {...otherProps}
      />
      <LabelFormModal
        open={open}
        user={user}
        label={label}
        escape={false}
        fragile={false}
        loading={loading}
        onClose={handleModalClose}
        onSubmit={handleLabelFormSubmit}
      />
    </>
  );
};

EditLabelButton.displayName = 'EditLabelButton';

export default EditLabelButton;
