import { render } from 'mustache';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import cache from '../../../../cache';
import * as TEXTS from '../../../../constants/texts';
import Label from '../../../../models/Label';
import { actions as personalActions } from '../../../../store/slices/personal';
import * as questions from '../../../../templates/questions';
import IconButton, { IconName } from '../../../IconButton/IconButton';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  user: string;
  label: Label;
  index: number;
}

const RemoveLabelButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { className, user: userID, label, index } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const user = cache.getUser(userID);
    const question = render(questions.remove.label, { user, label });
    const confirmed = window.confirm(question);
    if (confirmed) {
      dispatch(personalActions.remove({ user: userID, index }));
    }
  }, [userID, label, index]);

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

export default RemoveLabelButton;
