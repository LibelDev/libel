import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import * as TEXTS from '../../../constants/texts';
import { selectSubscriptions } from '../../../store/selectors';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.scss';
import AddSubscriptionButton from './AddSubscriptionButton/AddSubscriptionButton';
import SubscriptionItem from './SubscriptionItem/SubscriptionItem';
import styles from './SubscriptionSection.scss';

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
    </React.Fragment>
  );
};

export default SubscriptionSection;
