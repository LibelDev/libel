import React, { useMemo } from 'react';
import { mapDataSetsToLabelsGroupsGroupedByText } from '../../helpers/labelList';
import { createUserPersonalLabelsSelector, createUserPersonalSelector, createUserSubscriptionLabelsSelector, createUserSubscriptionsSelector } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import GroupedLabelItem, { IProps as IGroupedLabelItemProps } from './GroupedLabelItem/GroupedLabelItem';
import styles from './LabelList.module.scss';

interface IProps extends Pick<IGroupedLabelItemProps, 'floatingConfig'> {
  user: string;
}

type TProps = IProps;

const LabelList: React.FunctionComponent<TProps> = (props) => {
  const { user, floatingConfig } = props;
  const personal = useTypedSelector(createUserPersonalSelector(user));
  const subscriptions = useTypedSelector(createUserSubscriptionsSelector(user));
  const personalLabels = useTypedSelector(createUserPersonalLabelsSelector(user));
  const subscriptionLabels = useTypedSelector(createUserSubscriptionLabelsSelector(user));

  const labelsGroups = useMemo(() => {
    const dataSets = [personal, ...subscriptions];
    return mapDataSetsToLabelsGroupsGroupedByText(dataSets);
  }, [personalLabels, subscriptionLabels]);

  if (labelsGroups.length === 0) {
    return null;
  }

  return (
    <ul className={styles.labelList}>
      {
        labelsGroups.map((labelsGroup, index) => {
          const { text, items } = labelsGroup;
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

LabelList.displayName = 'LabelList';

export default LabelList;
