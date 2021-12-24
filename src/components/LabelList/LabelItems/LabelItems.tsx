import React, { useCallback } from 'react';
import useDataSetThemeColorStyle from '../../../hooks/useDataSetThemeColorStyle';
import Personal from '../../../models/Personal';
import Subscription from '../../../models/Subscription';
import LabelInfo from '../LabelInfo/LabelInfo';
import styles from './LabelItems.scss';
import invert from 'invert-color';

interface IProps {
  dataSet: Personal | Subscription;
  user: string;
  hasInfo: boolean;
}

const LabelItems: React.FunctionComponent<IProps> = (props) => {
  const { dataSet, user, hasInfo } = props;
  const labels = dataSet.data[user] || [];

  const dataSetThemeColorStyle = useDataSetThemeColorStyle(dataSet, useCallback((color) => ({
    backgroundColor: color,
    borderColor: color,
    color: invert(color, true)
  }), []));

  return labels.length === 0 ? null : (
    <React.Fragment>
      {
        labels.map((label, index) => (
          <li
            key={index}
            tabIndex={0}
            className={styles.labelItem}
            style={dataSetThemeColorStyle}
            aria-label={label.text}
          >
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
