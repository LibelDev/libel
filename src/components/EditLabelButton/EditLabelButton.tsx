import type React from 'react';
import { useCallback, useState } from 'react';
import * as TEXTS from '../../constants/texts';
import * as gtag from '../../helpers/gtag';
import type { ILabel } from '../../models/Label';
import { actions as personalActions } from '../../store/slices/personal';
import { useTypedDispatch } from '../../store/store';
import { EventAction, EventCategory, EventLabel } from '../../types/ga';
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
    <>
      <IconButton
        className={className}
        icon={IconName.Pencil}
        aria-label={TEXTS.BUTTON_TEXT_LABEL_EDIT}
        data-tip={TEXTS.BUTTON_TEXT_LABEL_EDIT}
        title={TEXTS.BUTTON_TEXT_LABEL_EDIT}
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
    </>
  );
};

EditLabelButton.displayName = 'EditLabelButton';

export default EditLabelButton;
