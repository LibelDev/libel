import { render } from 'mustache';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import cache from '../../../../../../cache';
import * as TEXTS from '../../../../../../constants/texts';
import { MappedHTMLAttributes } from '../../../../../../helpers/types';
import Label from '../../../../../../models/Label';
import { actions as personalActions } from '../../../../../../store/slices/personal';
import * as questions from '../../../../../../templates/questions';
import { IconName } from '../../../../../../types/icon';
import IconButton from '../../../../../IconButton/IconButton';

interface IProps {
  user: string;
  index: number;
  label: Label;
}

type TProps = IProps & MappedHTMLAttributes<'button'>;

const RemoveLabelButton: React.FunctionComponent<TProps> = (props) => {
  const dispatch = useDispatch();
  const { className, user, index, label } = props;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const _user = cache.getUser(user);
    const question = render(questions.remove.label, { user: _user, label });
    const confirmed = window.confirm(question);
    if (confirmed) {
      dispatch(personalActions.remove({ user, index }));
    }
  }, [user, label, label]);

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