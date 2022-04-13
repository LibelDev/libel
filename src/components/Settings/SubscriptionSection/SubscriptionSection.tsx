import classNames from 'classnames';
import React from 'react';
import * as TEXTS from '../../../constants/texts';
import { selectSubscriptions } from '../../../store/selectors';
import { useTypedSelector } from '../../../store/store';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import AddSubscriptionButton from './AddSubscriptionButton/AddSubscriptionButton';
import SubscriptionItem from './SubscriptionItem/SubscriptionItem';
import styles from './SubscriptionSection.module.scss';

const SubscriptionSection: React.FunctionComponent = () => {
  const subscriptions = useTypedSelector(selectSubscriptions);
  return (
    <React.Fragment>
      <small className={classNames(lihkgCssClasses.settingSectionTitle, styles.sectionTitle)}>
        {TEXTS.SETTINGS_SECTION_TITLE_SUBSCRIPTION}
        <AddSubscriptionButton />
      </small>
      {
        subscriptions.length > 0 ? (
          <ul className={lihkgCssClasses.settingOptionsList}>
            {
              subscriptions.map((subscription, index) => {
                return (
                  <li key={subscription.url} className={lihkgCssClasses.settingOptionsItem}>
                    <SubscriptionItem
                      className={styles.subscription}
                      subscription={subscription}
                      index={index}
                    />
                  </li>
                );
              })
            }
          </ul>
        ) : (
          <div className={lihkgCssClasses.settingOptionsList}>
            <div className={lihkgCssClasses.settingOptionsItem}>
              <span className={styles.empty}>
                {TEXTS.SUBSCRIPTION_LIST_MESSAGE_EMPTY}
              </span>
            </div>
          </div>
        )
      }
    </React.Fragment>
  );
};

SubscriptionSection.displayName = 'SubscriptionSection';

export default SubscriptionSection;
