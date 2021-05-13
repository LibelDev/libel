import classnames from 'classnames';
import React, { useMemo } from 'react';
import styles from './LabelInfo.scss';
import EditLabelButton from './EditLabelButton/EditLabelButton';
import RemoveLabelButton from './RemoveLabelButton/RemoveLabelButton';
import LabelSourceButton from './LabelSourceButton/LabelSourceButton';
import LabelProviderIcon from './LabelProviderIcon/LabelProviderIcon';
import useDataSetThemeColorStyle from '../../../hooks/useDataSetThemeColorStyle';
import { ILabel } from '../../../models/Label';
import Personal from '../../../models/Personal';
import Subscription from '../../../models/Subscription';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  user: string;
  label: ILabel;
  index: number;
  dataSet: Personal | Subscription;
}

const LabelInfo: React.FunctionComponent<IProps> = (props) => {
  const { className, user, label, index, dataSet } = props;

  const dataSetThemeColorStyle = useDataSetThemeColorStyle(dataSet, 'borderColor');
 
  return (
    <div className={classnames(className, styles.labelInfo)} style={dataSetThemeColorStyle}>
      {
        label.reason && (
          <div className={styles.reason}>
            {label.reason}
          </div>
        )
      }
      <div className={styles.buttons}>
        {
          !Subscription.implements(dataSet) && (
            <EditLabelButton className={styles.button} user={user} label={label} index={index} />
          )
        }
        <LabelSourceButton className={styles.button} label={label} />
        {
          Subscription.implements(dataSet) ?
            <LabelProviderIcon className={styles.button} subscription={dataSet} /> :
            <RemoveLabelButton className={styles.button} user={user} label={label} index={index} />
        }
      </div>
    </div>
  );
};

export default LabelInfo;
