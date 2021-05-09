import classnames from 'classnames';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './SubscriptionSection.scss';
import AddSubscriptionButton from './AddSubscriptionButton/AddSubscriptionButton';
import ReloadSubscriptionButton from './ReloadSubscriptionButton/ReloadSubscriptionButton';
import RemoveSubscriptionButton from './RemoveSubscriptionButton/RemoveSubscriptionButton';
import ToggleSubscriptionButton from './ToggleSubscriptionButton/ToggleSubscriptionButton';
import Icon, { IconName } from '../../Icon/Icon';
import IconButton from '../../IconButton/IconButton';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import * as TEXTS from '../../../constants/texts';
import { selectSubscriptions } from '../../../store/selectors';
import { load } from '../../../store/slices/subscriptions';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.scss';

const SubscriptionSection: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const subscriptions = useSelector(selectSubscriptions);

  const handleReload = (index: number) => {
    dispatch(load(index));
  };

  return (
    <React.Fragment>
      <small className={classnames(lihkgCssClasses.settingSectionTitle, styles.sectionTitle)}>
        {TEXTS.SETTING_SUBSCRIPTION_SECTION_TITLE}
        <AddSubscriptionButton />
      </small>
      <ul className={lihkgCssClasses.settingOptionsList}>
        {
          subscriptions.map((subscription, index) => (
            <li key={subscription.url} className={classnames(lihkgCssClasses.settingOptionsItem, styles.subscription)}>
              {
                subscription.error ? (
                  <Icon
                    icon={IconName.CommentAlert}
                    aria-label={subscription.error}
                    data-tip={subscription.error}
                    title={subscription.error}
                  />
                ) : (
                  subscription.loading ? (
                    <LoadingSpinner />
                  ) : (
                    subscription.version && (
                      <Icon
                        icon={IconName.Verified}
                        aria-label={TEXTS.SUBSCRIPTION_LOAD_SUCCESS}
                        data-tip={TEXTS.SUBSCRIPTION_LOAD_SUCCESS}
                        title={TEXTS.SUBSCRIPTION_LOAD_SUCCESS}
                      />
                    )
                  )
                )
              }
              <a className={styles.name} href={subscription.url} target="_blank">
                {subscription.name || subscription.url}
              </a>
              <RemoveSubscriptionButton
                subscription={subscription}
                index={index}
              />
              <ReloadSubscriptionButton
                subscription={subscription}
                index={index}
              />
              <ToggleSubscriptionButton
                subscription={subscription}
                index={index}
              />
            </li>
          ))
        }
      </ul>
    </React.Fragment>
  );
};

export default SubscriptionSection;
