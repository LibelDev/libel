import React, { useMemo } from 'react';
import { groupByText } from '../../helpers/label';
import { createUserPersonalLabelsSelector, createUserPersonalSelector, createUserSubscriptionLabelsSelector, createUserSubscriptionsSelector } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import GroupedLabelItem, { IProps as IGroupedLabelItemProps } from './GroupedLabelItem/GroupedLabelItem';
import styles from './LabelList.module.scss';

interface IProps extends Pick<IGroupedLabelItemProps, 'floatingConfig'> {
  user: string;
}

const LabelList: React.FunctionComponent<IProps> = (props) => {
  const { user, floatingConfig } = props;
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
                floatingConfig={floatingConfig}
              />
            </li>
          );
        })
      }
    </ul>
  );
};

export default LabelList;
