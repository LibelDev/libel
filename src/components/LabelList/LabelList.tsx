import { Strategy } from '@floating-ui/react-dom';
import React, { useMemo } from 'react';
import { groupByText } from '../../helpers/label';
import { createUserPersonalLabelsSelector, createUserPersonalSelector, createUserSubscriptionLabelsSelector, createUserSubscriptionsSelector } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import GroupedLabelItem from './GroupedLabelItem/GroupedLabelItem';
import styles from './LabelList.module.scss';

interface IProps {
  user: string;
  floatingStrategy?: Strategy;
}

const LabelList: React.FunctionComponent<IProps> = (props) => {
  const { user, floatingStrategy } = props;
  const personal = useTypedSelector(createUserPersonalSelector(user));
  const subscriptions = useTypedSelector(createUserSubscriptionsSelector(user));
  const personalLabels = useTypedSelector(createUserPersonalLabelsSelector(user));
  const subscriptionLabels = useTypedSelector(createUserSubscriptionLabelsSelector(user));

  const groupedLabels = useMemo(() => {
    return groupByText(user, [personal, ...subscriptions]);
  }, [personalLabels, subscriptionLabels]);

  if (groupedLabels.length === 0) {
    return null;
  }

  return (
    <ul className={styles.labelList}>
      {
        groupedLabels.map((groupedLabel, index) => {
          const { text, items } = groupedLabel;
          return (
            <li key={index}>
              <GroupedLabelItem
                text={text}
                items={items}
                floatingStrategy={floatingStrategy}
              />
            </li>
          );
        })
      }
    </ul>
  );
};

export default LabelList;
