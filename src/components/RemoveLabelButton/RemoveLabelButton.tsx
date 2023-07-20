import { render } from 'mustache';
import type React from 'react';
import { useCallback } from 'react';
import * as TEXTS from '../../constants/texts';
import { getElementLabelTipProps } from '../../helpers/common';
import * as gtag from '../../helpers/gtag';
import useResponseCache from '../../hooks/useResponseCache';
import type { ILabel } from '../../models/Label';
import { actions as personalActions } from '../../store/slices/personal';
import { useTypedDispatch } from '../../store/store';
import * as questions from '../../templates/questions';
import { EventAction, EventCategory } from '../../types/ga';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';

interface IProps {
  user: string;
  index: number;
  label: ILabel;
}

type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

type TProps = IProps & TComponentProps;

const RemoveLabelButton: React.FunctionComponent<TProps> = (props) => {
  const { user, index, label, ...otherProps } = props;

  const dispatch = useTypedDispatch();
  const cache = useResponseCache();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    const _user = cache?.getUser(user);
    const question = render(questions.remove.label, { user: _user, label });
    const yes = window.confirm(question);
    if (yes) {
      dispatch(personalActions.remove({ user, index }));
      // analytics
      gtag.event(EventAction.Remove, { event_category: EventCategory.Label, event_label: label.text });
    }
  }, [user, index, label]);

  return (
    <IconButton
      icon={IconName.DeleteForever}
      onClick={handleClick}
      {...getElementLabelTipProps(TEXTS.BUTTON_TEXT_LABEL_REMOVE)}
      {...otherProps}
    />
  );
};

RemoveLabelButton.displayName = 'RemoveLabelButton';

export default RemoveLabelButton;
