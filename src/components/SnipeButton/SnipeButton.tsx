import classnames from 'classnames';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as TEXTS from '../../constants/texts';
import { waitForSubmissionForm } from '../../helpers/lihkg';
import { findReactComponent } from '../../helpers/react';
import { renderSnipingBody } from '../../helpers/sniping';
import { filterPersonalForUser, filterSubscriptionsForUser } from '../../store/selectors';
import lihkgCssClasses from '../../stylesheets/variables/lihkg/classes.scss';
import { IconName } from '../../types/icon';
import IconButton from '../IconButton/IconButton';
import SubmissionForm from '../SubmissionForm/SubmissionForm';
import styles from './SnipeButton.scss';

interface IProps {
  user: string;
}

const SnipeButton: React.FunctionComponent<IProps> = (props) => {
  const { user } = props;
  const personal = useSelector(filterPersonalForUser(user));
  const subscriptions = useSelector(filterSubscriptionsForUser(user));

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(async (event) => {
    event.preventDefault();
    const { currentTarget } = event;
    const replyButton = currentTarget.parentNode?.parentNode?.querySelector<HTMLElement>(`.${IconName.Reply}`);
    if (replyButton) {
      const awaiter = waitForSubmissionForm();
      replyButton.click();
      const element = await awaiter;
      const formComponent = findReactComponent(element, 1);
      const body = renderSnipingBody(user, personal, subscriptions);
      if (formComponent && body) {
        (formComponent as SubmissionForm).replaceEditorContent(body);
      }
    }
  }, [personal, subscriptions]);

  return (
    <IconButton
      className={classnames(lihkgCssClasses.replyToolbarButton, styles.snipeButton)}
      icon={IconName.Hot}
      onClick={handleClick}
      aria-label={TEXTS.SNIPE_BUTTON_TEXT}
      data-tip={TEXTS.SNIPE_BUTTON_TEXT}
      title={TEXTS.SNIPE_BUTTON_TEXT}
    />
  );
};

export default SnipeButton;
