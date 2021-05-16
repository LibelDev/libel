import classnames from 'classnames';
import React from 'react';
import useDataSetThemeColorStyle from '../../../hooks/useDataSetThemeColorStyle';
import Label from '../../../models/Label';
import Personal from '../../../models/Personal';
import Subscription from '../../../models/Subscription';
import EditLabelButton from './EditLabelButton/EditLabelButton';
import styles from './LabelInfo.scss';
import LabelProviderIcon from './LabelProviderIcon/LabelProviderIcon';
import LabelSourceButton from './LabelSourceButton/LabelSourceButton';
import RemoveLabelButton from './RemoveLabelButton/RemoveLabelButton';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  user: string;
  label: Label;
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
