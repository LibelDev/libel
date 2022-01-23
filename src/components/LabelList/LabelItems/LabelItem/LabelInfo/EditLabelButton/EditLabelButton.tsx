import React, { useCallback, useState } from 'react';
import { EventAction, EventCategory } from '../../../../../../constants/ga';
import * as TEXTS from '../../../../../../constants/texts';
import { MappedHTMLAttributes } from '../../../../../../helpers/types';
import * as gtag from '../../../../../../helpers/gtag';
import Label from '../../../../../../models/Label';
import { actions as personalActions } from '../../../../../../store/slices/personal';
import { useTypedDispatch } from '../../../../../../store/store';
import { IconName } from '../../../../../../types/icon';
import IconButton from '../../../../../IconButton/IconButton';
import LabelFormModal, { TLabelFormProps } from '../../../../../LabelFormModal/LabelFormModal';

interface IProps {
  user: string;
  index: number;
  label: Label;
}

type TProps = IProps & MappedHTMLAttributes<'button'>;

const EditLabelButton: React.FunctionComponent<TProps> = (props) => {
  const { className, user, index, label } = props;

  const [open, setOpen] = useState(false);
  const dispatch = useTypedDispatch();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    setOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLabelFormSubmit: TLabelFormProps['onSubmission'] = useCallback(async (event, data) => {
    const { text, reason, color, image } = data;
    dispatch(personalActions.edit({ user, index, text, reason, color, image }));
    handleModalClose();
    // analytics
    gtag.event(EventAction.Edit, { category: EventCategory.Label, label: text });
  }, [user, index, handleModalClose]);

  return (
    <React.Fragment>
      <IconButton
        className={className}
        icon={IconName.Pencil}
        aria-label={TEXTS.EDIT_LABEL_BUTTON_TEXT}
        data-tip={TEXTS.EDIT_LABEL_BUTTON_TEXT}
        title={TEXTS.EDIT_LABEL_BUTTON_TEXT}
        onClick={handleClick}
      />
      <LabelFormModal
        open={open}
        user={user}
        data={label}
        escape={false}
        fragile={false}
        onClose={handleModalClose}
        onSubmission={handleLabelFormSubmit}
      />
    </React.Fragment>
  );
};

export default EditLabelButton;
