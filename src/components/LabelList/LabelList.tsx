import flatMap from 'lodash/flatMap';
import React from 'react';
import { useSelector } from 'react-redux';
import { filterPersonalForUser, filterSubscriptionsForUser } from '../../store/selectors';
import SnipeButton from '../SnipeButton/SnipeButton';
import LabelItems from './LabelItems/LabelItems';
import styles from './LabelList.scss';

interface IProps {
  user: string;
  hasInfo: boolean;
  hasSnipeButton: boolean;
}

const LabelList: React.FunctionComponent<IProps> = (props) => {
  const { user, hasInfo, hasSnipeButton } = props;
  const personal = useSelector(filterPersonalForUser(user));
  const { labels: personalLabels } = personal.aggregate();
  const subscriptions = useSelector(filterSubscriptionsForUser(user));
  const subscriptionLabels = flatMap(
    subscriptions.map((subscription) => subscription.aggregate()),
    ({ labels }) => labels
  );
  return (personalLabels.length || subscriptionLabels.length) ? (
    <React.Fragment>
      <ul className={styles.labelList}>
        <LabelItems
          dataSet={personal}
          user={user}
          hasInfo={hasInfo}
        />
        {
          subscriptions.map((subscription, index) => (
            <LabelItems
              key={index}
              dataSet={subscription}
              user={user}
              hasInfo={hasInfo}
            />
          ))
        }
      </ul>
      {
        hasSnipeButton && !!(personal.data[user]?.length || subscriptionLabels.length) && (
          <SnipeButton user={user} />
        )
      }
    </React.Fragment>
  ) : null;
};

export default LabelList;
