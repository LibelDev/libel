import classNames from 'classnames';
import type React from 'react';
import { useCallback } from 'react';
import * as TEXTS from '../../constants/texts';
import { getElementLabelTipProps } from '../../helpers/common';
import * as gtag from '../../helpers/gtag';
import { waitForSubmissionForm } from '../../helpers/lihkg';
import { findReactComponent } from '../../helpers/react';
import { renderSnipingBody } from '../../helpers/sniping';
import useResponseCache from '../../hooks/useResponseCache';
import { createUserPersonalLabelsSelector, createUserPersonalSelector, createUserSubscriptionLabelsSelector, createUserSubscriptionsSelector } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import lihkgCssClasses from '../../stylesheets/variables/lihkg/classes.module.scss';
import { EventAction } from '../../types/ga';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import SubmissionForm from '../SubmissionForm/SubmissionForm';
import styles from './SnipeButton.module.scss';

interface IProps {
  user: string;
}

type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

type TProps = IProps & TComponentProps;

const SnipeButton: React.FunctionComponent<TProps> = (props) => {
  const { className, user } = props;
  const personal = useTypedSelector(createUserPersonalSelector(user));
  const subscriptions = useTypedSelector(createUserSubscriptionsSelector(user));
  const personalLabels = useTypedSelector(createUserPersonalLabelsSelector(user));
  const subscriptionLabels = useTypedSelector(createUserSubscriptionLabelsSelector(user));
  const cache = useResponseCache();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(async (event) => {
    event.preventDefault();
    const { currentTarget } = event;
    const replyButton = currentTarget.parentNode?.parentNode?.parentNode?.querySelector<HTMLElement>(`.${IconName.Reply}`);
    if (replyButton) {
      const awaiter = waitForSubmissionForm();
      replyButton.click();
      const element = await awaiter;
      const formComponent = findReactComponent<SubmissionForm>(element, 1);
      if (formComponent) {
        const _user = cache?.getUser(user);
        if (_user) {
          const body = renderSnipingBody(_user, personal, subscriptions);
          formComponent.replaceEditorContent(body);
          // analytics
          gtag.event(EventAction.Snipe, { event_label: user });
        }
      }
    }
  }, [personal, subscriptions]);

  if (personalLabels.length === 0 && subscriptionLabels.length === 0) {
    return null;
  }

  return (
    <IconButton
      className={classNames(className, styles.snipeButton)}
      icon={IconName.Hot}
      onClick={handleClick}
      {...getElementLabelTipProps(TEXTS.BUTTON_TEXT_SNIPE)}
    />
  );
};

SnipeButton.displayName = 'SnipeButton';

export default SnipeButton;

export const createContainer = () => {
  const container = document.createElement('div');
  container.classList.add(lihkgCssClasses.replyToolbarButton);
  container.classList.add(styles.container);
  return container;
};
