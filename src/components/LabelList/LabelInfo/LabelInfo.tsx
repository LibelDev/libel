import classnames from 'classnames';
import React, { useMemo } from 'react';
import styles from './LabelInfo.scss';
import EditLabelButton from './EditLabelButton/EditLabelButton';
import RemoveLabelButton from './RemoveLabelButton/RemoveLabelButton';
import LabelSourceButton from './LabelSourceButton/LabelSourceButton';
import LabelProviderIcon from './LabelProviderIcon/LabelProviderIcon';
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
  return (
    <div className={classnames(className, styles.labelInfo)}>
      {
        label.reason && (
          <div className={styles.reason}>
            {label.reason}
          </div>
        )
      }
      <div className={styles.buttons}>
        {
          !Subscription.is(dataSet) && (
            <EditLabelButton className={styles.button} user={user} label={label} index={index} />
          )
        }
        <LabelSourceButton className={styles.button} label={label} />
        {
          Subscription.is(dataSet) ?
            <LabelProviderIcon className={styles.button} subscription={dataSet} /> :
            <RemoveLabelButton className={styles.button} user={user} label={label} index={index} />
        }
      </div>
    </div>
  );
};

export default LabelInfo;
