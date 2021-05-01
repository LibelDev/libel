import React from 'react';
import { useDispatch } from 'react-redux';
import IconButton, { IconName } from '../../../IconButton/IconButton';
import cache from '../../../../cache';
import * as TEXTS from '../../../../constants/texts';
import * as PLACEHOLDERS from '../../../../constants/placeholders';
import { ILabel } from '../../../../models/Label';
import { remove } from '../../../../store/slices/personal';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  user: string;
  label: ILabel;
  index: number;
}

const DeleteLabelButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { className, user, label, index } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    const _user = cache.getUser(user);
    const question = TEXTS.REMOVE_LABEL_QUESTION
      .replace(PLACEHOLDERS.USERNAME, _user!.nickname)
      .replace(PLACEHOLDERS.LABEL_TEXT, label.text);
    const confirmed = window.confirm(question);
    if (confirmed) {
      dispatch(remove({ user, index }));
    }
  };

  return (
    <IconButton
      className={className}
      icon={IconName.DeleteForever}
      aria-label={TEXTS.REMOVE_LABEL_BUTTON_TEXT}
      data-tip={TEXTS.REMOVE_LABEL_BUTTON_TEXT}
      title={TEXTS.REMOVE_LABEL_BUTTON_TEXT}
      onClick={handleClick}
    />
  );
};

export default DeleteLabelButton;
