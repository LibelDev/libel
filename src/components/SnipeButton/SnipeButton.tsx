import classnames from 'classnames';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as TEXTS from '../../constants/texts';
import { renderSnipeBody } from '../../helpers/label';
import { waitForSubmissionForm } from '../../helpers/lihkg';
import { findReactComponent } from '../../helpers/react';
import { filterPersonal, filterSubscriptions } from '../../store/selectors';
import lihkgCssClasses from '../../stylesheets/variables/lihkg/classes.scss';
import IconButton, { IconName } from '../IconButton/IconButton';
import SubmissionForm from '../SubmissionForm/SubmissionForm';
import styles from './SnipeButton.scss';

interface IProps {
  user: string;
}

const SnipeButton: React.FunctionComponent<IProps> = (props) => {
  const { user } = props;
  const buttonRef = React.createRef<HTMLButtonElement>();
  const personal = useSelector(filterPersonal(user));
  const subscriptions = useSelector(filterSubscriptions(user));

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(async (event) => {
    event.preventDefault();
    const awaiter = waitForSubmissionForm();
    const replyButton = buttonRef.current!.parentNode!.parentNode!.querySelector<HTMLLIElement>('.i-reply');
    replyButton!.click();
    const element = await awaiter;
    const formComponent = findReactComponent(element, 1) as SubmissionForm;
    const body = renderSnipeBody(user, personal, subscriptions);
    if (formComponent && body) {
      formComponent.replaceEditorContent(body);
    }
  }, [personal, subscriptions]);

  return (
    <IconButton
      ref={buttonRef}
      className={classnames(lihkgCssClasses.replyToolbarButton, styles.snipeButton)}
      icon={IconName.Hot}
      aria-label={TEXTS.SNIPE_BUTTON_TEXT}
      data-tip={TEXTS.SNIPE_BUTTON_TEXT}
      title={TEXTS.SNIPE_BUTTON_TEXT}
      onClick={handleClick}
    />
  );
};

export default SnipeButton;
