import React, { useCallback, useState } from 'react';
import { EventAction, EventCategory, EventLabel } from '../../constants/ga';
import * as TEXTS from '../../constants/texts';
import * as gtag from '../../helpers/gtag';
import type { ILabel } from '../../models/Label';
import { actions as personalActions } from '../../store/slices/personal';
import { useTypedDispatch } from '../../store/store';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import LabelFormModal, { TLabelFormProps } from '../LabelFormModal/LabelFormModal';

interface IProps {
  user: string;
  index: number;
  label: ILabel;
}

type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

type TProps = IProps & TComponentProps;

const EditLabelButton: React.FunctionComponent<TProps> = (props) => {
  const { className, user, index, label } = props;

  const dispatch = useTypedDispatch();
  const [open, setOpen] = useState(false);

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
    dispatch(personalActions.edit({ user, index, text, reason, color, image }));
    handleModalClose();
    // analytics
    gtag.event(EventAction.Edit, { event_category: EventCategory.Label, event_label: text });
  }, [user, index, handleModalClose]);

  return (
    <React.Fragment>
      <IconButton
        className={className}
        icon={IconName.Pencil}
        aria-label={TEXTS.BUTTON_TEXT_EDIT_LABEL}
        data-tip={TEXTS.BUTTON_TEXT_EDIT_LABEL}
        title={TEXTS.BUTTON_TEXT_EDIT_LABEL}
        onClick={handleClick}
      />
      <LabelFormModal
        open={open}
        user={user}
        label={label}
        escape={false}
        fragile={false}
        onClose={handleModalClose}
        onSubmit={handleLabelFormSubmit}
      />
    </React.Fragment>
  );
};

EditLabelButton.displayName = 'EditLabelButton';

export default EditLabelButton;
