import React, { useMemo } from 'react';
import { groupDataSetsByLabelText } from '../../helpers/dataSet';
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

  const groupedLabelItems = useMemo(() => {
    const dataSets = [personal, ...subscriptions];
    return groupDataSetsByLabelText(dataSets);
  }, [personalLabels, subscriptionLabels]);

  if (groupedLabelItems.length === 0) {
    return null;
  }

  return (
    <ul className={styles.labelList}>
      {
        groupedLabelItems.map((groupedLabelItem, index) => {
          const { text, items } = groupedLabelItem;
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
