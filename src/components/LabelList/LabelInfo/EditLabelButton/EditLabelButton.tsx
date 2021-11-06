import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import * as TEXTS from '../../../../constants/texts';
import { promptEdit } from '../../../../helpers/label';
import Label from '../../../../models/Label';
import { actions as personalActions } from '../../../../store/slices/personal';
import { IconName } from '../../../../types/icon';
import IconButton from '../../../IconButton/IconButton';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  user: string;
  label: Label;
  index: number;
}

const EditLabelButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { className, user, label, index } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const { text, reason, image } = label;
    const data = promptEdit(text, reason, image);
    if (data) {
      const { text, reason, image } = data;
      dispatch(personalActions.edit({ user, index, text, reason, image }));
    }
  }, [user, label, index]);

  return (
    <IconButton
      className={className}
      icon={IconName.Pencil}
      aria-label={TEXTS.EDIT_LABEL_BUTTON_TEXT}
      data-tip={TEXTS.EDIT_LABEL_BUTTON_TEXT}
      title={TEXTS.EDIT_LABEL_BUTTON_TEXT}
      onClick={handleClick}
    />
  );
};

export default EditLabelButton;
