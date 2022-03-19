import { render } from 'mustache';
import React, { useCallback } from 'react';
import cache from '../../../../cache';
import { EventAction, EventCategory } from '../../../../constants/ga';
import * as TEXTS from '../../../../constants/texts';
import * as gtag from '../../../../helpers/gtag';
import { ILabel } from '../../../../models/Label';
import { actions as personalActions } from '../../../../store/slices/personal';
import { useTypedDispatch } from '../../../../store/store';
import * as questions from '../../../../templates/questions';
import { IconName } from '../../../../types/icon';
import IconButton from '../../../IconButton/IconButton';

interface IProps {
  user: string;
  index: number;
  label: ILabel;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'button'>;

const RemoveLabelButton: React.FunctionComponent<TProps> = (props) => {
  const { className, user, index, label } = props;

  const dispatch = useTypedDispatch();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const _user = cache.getUser(user);
    const question = render(questions.remove.label, { user: _user, label });
    const confirmed = window.confirm(question);
    if (confirmed) {
      dispatch(personalActions.remove({ user, index }));
      // analytics
      gtag.event(EventAction.Remove, { event_category: EventCategory.Label, event_label: label.text });
    }
  }, [user, index, label]);

  return (
    <IconButton
      className={className}
      icon={IconName.DeleteForever}
      aria-label={TEXTS.BUTTON_TEXT_REMOVE_LABEL}
      data-tip={TEXTS.BUTTON_TEXT_REMOVE_LABEL}
      title={TEXTS.BUTTON_TEXT_REMOVE_LABEL}
      onClick={handleClick}
    />
  );
};

export default RemoveLabelButton;
