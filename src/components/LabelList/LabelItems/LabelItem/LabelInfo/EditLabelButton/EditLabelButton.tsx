import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../../../constants/texts';
import { MappedHTMLAttributes } from '../../../../../../helpers/types';
import Label from '../../../../../../models/Label';
import { actions as personalActions } from '../../../../../../store/slices/personal';
import { IconName } from '../../../../../../types/icon';
import IconButton from '../../../../../IconButton/IconButton';
import LabelFormModal, { TLabelFormProps } from '../../../../../LabelFormModal/LabelFormModal';

interface IProps {
  user: string;
  label: Label;
}

type TProps = IProps & MappedHTMLAttributes<'button'>;

const EditLabelButton: React.FunctionComponent<TProps> = (props) => {
  const { className, user, label } = props;

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    setOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLabelFormSubmit: TLabelFormProps['onSubmission'] = async (event, data) => {
    const { text, reason, color, image } = data;
    dispatch(personalActions.edit({ user, label, text, reason, color, image }));
    handleModalClose();
  };

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
