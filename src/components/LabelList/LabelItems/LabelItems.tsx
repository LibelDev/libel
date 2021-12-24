import React from 'react';
import Personal from '../../../models/Personal';
import Subscription from '../../../models/Subscription';
import LabelItem from './LabelItem';

interface IProps {
  dataSet: Personal | Subscription;
  user: string;
}

const LabelItems: React.FunctionComponent<IProps> = (props) => {
  const { dataSet, user } = props;
  const labels = dataSet.data[user] || [];
  return (
    labels.length > 0 ? (
      <React.Fragment>
        {
          labels.map((label, index) => (
            <LabelItem
              key={index}
              dataSet={dataSet}
              user={user}
              label={label}
              index={index}
            />
          ))
        }
      </React.Fragment>
    ) : null
  );
};

export default LabelItems;
