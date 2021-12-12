import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import Label from '../../../../models/Label';
import { actions as personalActions } from '../../../../store/slices/personal';
import { IconName } from '../../../../types/icon';
import IconButton from '../../../IconButton/IconButton';
import LabelFormModal, { ILabelFormProps } from '../../../LabelFormModal/LabelFormModal';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  user: string;
  label: Label;
  index: number;
}

const EditLabelButton: React.FunctionComponent<IProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { className, user, label, index } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    if (!loading) {
      setOpen(true);
    }
  }, [loading]);

  const handleModalClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLabelFormSubmit: ILabelFormProps['onSubmission'] = async (event, label) => {
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
        loading={loading}
        onClose={handleModalClose}
        onSubmission={handleLabelFormSubmit}
      />
    </React.Fragment>
  );
};

export default EditLabelButton;
