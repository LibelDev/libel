import React, { useMemo } from 'react';
import styles from './LabelItems.scss';
import LabelInfo from '../LabelInfo/LabelInfo';
import useDataSetThemeColorStyle from '../../../hooks/useDataSetThemeColorStyle';
import Personal from '../../../models/Personal';
import Subscription from '../../../models/Subscription';

interface IProps {
  dataSet: Personal | Subscription;
  user: string;
  hasInfo: boolean;
}

const LabelItems: React.FunctionComponent<IProps> = (props) => {
  const { dataSet, user, hasInfo } = props;
  const labels = dataSet.data[user] || [];

  const dataSetThemeColorStyle = useDataSetThemeColorStyle(dataSet, 'borderColor');

  return labels.length === 0 ? null : (
    <React.Fragment>
      {
        labels.map((label, index) => (
          <li className={styles.labelItem} key={index} tabIndex={0} aria-label={label.text} style={dataSetThemeColorStyle}>
            {
              hasInfo && (
                <LabelInfo
                  className={styles.labelInfo}
                  user={user}
                  label={label}
                  index={index}
                  dataSet={dataSet}
                />
              )
            }
          </li>
        ))
      }
    </React.Fragment>
  );
};

export default LabelItems;
