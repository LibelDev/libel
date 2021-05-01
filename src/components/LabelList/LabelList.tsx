import flatMap from 'lodash/flatMap';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './LabelList.scss';
import LabelItems from './LabelItems/LabelItems';
import SnipeButton from '../SnipeButton/SnipeButton';
import { filterPersonal, filterSubscriptions } from '../../store/selectors';
import { aggregate } from '../../helpers/label';

interface IProps {
  user: string;
  hasInfo: boolean;
  hasSnipeButton: boolean;
}

const LabelList: React.FunctionComponent<IProps> = (props) => {
  const { user, hasInfo, hasSnipeButton } = props;
  const personal = useSelector(filterPersonal(user));
  const { labels: personalLabels } = aggregate(personal);
  const subscriptions = useSelector(filterSubscriptions(user));
  const subscriptionLabels = flatMap(subscriptions.map(aggregate), ({ labels }) => labels);
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
