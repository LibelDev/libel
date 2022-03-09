import React from 'react';
import { createUserPersonalLabelsSelector, createUserPersonalSelector, createUserSubscriptionLabelsSelector, createUserSubscriptionsSelector } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import LabelItems from './LabelItems/LabelItems';
import styles from './LabelList.module.scss';

interface IProps {
  user: string;
}

const LabelList: React.FunctionComponent<IProps> = (props) => {
  const { user } = props;
  const personal = useTypedSelector(createUserPersonalSelector(user));
  const subscriptions = useTypedSelector(createUserSubscriptionsSelector(user));
  const personalLabels = useTypedSelector(createUserPersonalLabelsSelector(user));
  const subscriptionLabels = useTypedSelector(createUserSubscriptionLabelsSelector(user));

  if (personalLabels.length === 0 && subscriptionLabels.length === 0) {
    return null;
  }

  return (
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
    </ul>
  );
};

export default LabelList;
