import React from 'react';
import Personal from '../../../models/Personal';
import Subscription from '../../../models/Subscription';
import LabelItem from './LabelItem/LabelItem';
import styles from './LabelItems.scss';

interface IProps {
  dataSet: Personal | Subscription;
  user: string;
}

const LabelItems: React.FunctionComponent<IProps> = (props) => {
  const { dataSet, user } = props;

  const labels = dataSet.data[user] || [];
  const color = Subscription.implements(dataSet) ? dataSet.color : undefined;

  return (
    labels.length > 0 ? (
      <React.Fragment>
        {
          labels.map((label, index) => (
            <li key={index} className={styles.labelItem}>
              <LabelItem
                user={user}
                label={label}
                color={color}
                dataSet={dataSet}
              />
            </li>
          ))
        }
      </React.Fragment>
    ) : null
  );
};

export default LabelItems;
