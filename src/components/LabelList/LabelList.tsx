import React from 'react';
import { createUserPersonalLabelsSelector, createUserPersonalSelector, createUserSubscriptionLabelsSelector, createUserSubscriptionsSelector } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import SnipeButton from '../SnipeButton/SnipeButton';
import LabelItems from './LabelItems/LabelItems';
import styles from './LabelList.module.scss';

interface IProps {
  user: string;
  hasSnipeButton: boolean;
}

const LabelList: React.FunctionComponent<IProps> = (props) => {
  const { user, hasSnipeButton } = props;
  const personal = useTypedSelector(createUserPersonalSelector(user));
  const subscriptions = useTypedSelector(createUserSubscriptionsSelector(user));
  const personalLabels = useTypedSelector(createUserPersonalLabelsSelector(user));
  const subscriptionLabels = useTypedSelector(createUserSubscriptionLabelsSelector(user));
  return (
    (personalLabels.length || subscriptionLabels.length) ? (
      <ul className={styles.labelList}>
        <LabelItems
          dataSet={personal}
          user={user}
        />
        {
          subscriptions.map((subscription, index) => (
            <LabelItems
              key={index}
              dataSet={subscription}
              user={user}
            />
          ))
        }
        {
          hasSnipeButton && !!(personal.data[user]?.length || subscriptionLabels.length) && (
            <SnipeButton
              className={styles.snipeButton}
              user={user}
            />
          )
        }
      </ul>
    ) : null
  );
};

export default LabelList;
