import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import IconButton, { IconName } from '../../../IconButton/IconButton';
import * as TEXTS from '../../../../constants/texts';
import { prompt } from '../../../../helpers/label';
import { ILabel } from '../../../../models/Label';
import { actions as personalActions } from '../../../../store/slices/personal';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  user: string;
  label: ILabel;
  index: number;
}

const EditLabelButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { className, user, label, index } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const { text, reason } = label;
    const data = prompt(text, reason);
    if (data) {
      const { text, reason } = data;
      dispatch(personalActions.edit({ user, index, text, reason }));
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
