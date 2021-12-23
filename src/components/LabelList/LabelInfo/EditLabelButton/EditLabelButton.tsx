import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import { MappedHTMLAttributes } from '../../../../helpers/types';
import Label from '../../../../models/Label';
import { actions as personalActions } from '../../../../store/slices/personal';
import { IconName } from '../../../../types/icon';
import IconButton from '../../../IconButton/IconButton';
import LabelFormModal, { TLabelFormProps } from '../../../LabelFormModal/LabelFormModal';

interface IProps {
  user: string;
  label: Label;
  index: number;
}

type TProps = IProps & MappedHTMLAttributes<'button'>;

const EditLabelButton: React.FunctionComponent<TProps> = (props) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { className, user, label, index } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    setOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLabelFormSubmit: TLabelFormProps['onSubmission'] = async (event, label) => {
    const { text, reason, image } = label;
    dispatch(personalActions.edit({ user, index, text, reason, image }));
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
