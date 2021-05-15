import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import * as TEXTS from '../../../constants/texts';
import useDataSetThemeColorStyle from '../../../hooks/useDataSetThemeColorStyle';
import { selectSubscriptions } from '../../../store/selectors';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.scss';
import Icon, { IconName } from '../../Icon/Icon';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import AddSubscriptionButton from './AddSubscriptionButton/AddSubscriptionButton';
import ReloadSubscriptionButton from './ReloadSubscriptionButton/ReloadSubscriptionButton';
import RemoveSubscriptionButton from './RemoveSubscriptionButton/RemoveSubscriptionButton';
import styles from './SubscriptionSection.scss';
import ToggleSubscriptionButton from './ToggleSubscriptionButton/ToggleSubscriptionButton';

const SubscriptionSection: React.FunctionComponent = () => {
  const subscriptions = useSelector(selectSubscriptions);

  return (
    <React.Fragment>
      <small className={classnames(lihkgCssClasses.settingSectionTitle, styles.sectionTitle)}>
        {TEXTS.SETTING_SUBSCRIPTION_SECTION_TITLE}
        <AddSubscriptionButton />
      </small>
      <ul className={lihkgCssClasses.settingOptionsList}>
        {
          subscriptions.map((subscription, index) => {
            const dataSetThemeColorStyle = useDataSetThemeColorStyle(subscription, 'backgroundColor');
            return (
              <li key={subscription.url} className={classnames(lihkgCssClasses.settingOptionsItem, styles.subscription)}>
                <i className={styles.bar} style={dataSetThemeColorStyle} aria-hidden={true} />
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
            );
          })
        }
      </ul>
    </React.Fragment>
  );
};

export default SubscriptionSection;
