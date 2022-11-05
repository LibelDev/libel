import classNames from 'classnames';
import type React from 'react';
import { memo, useMemo } from 'react';
import * as TEXTS from '../../constants/texts';
import { getShareURL } from '../../helpers/label';
import type { IDataSet } from '../../models/DataSet';
import type { ILabel } from '../../models/Label';
import Subscription, { ISubscription } from '../../models/Subscription';
import EditLabelButton from '../EditLabelButton/EditLabelButton';
import EmoticonTranslator from '../EmoticonTranslator/EmoticonTranslator';
import LabelImageButton from '../LabelImageButton/LabelImageButton';
import LabelSourceButton from '../LabelSourceButton/LabelSourceButton';
import LabelSubscriptionButton from '../LabelSubscriptionButton/LabelSubscriptionButton';
import RemoveLabelButton from '../RemoveLabelButton/RemoveLabelButton';
import styles from './LabelInfo.module.scss';

interface IProps {
  user: string;
  index: number;
  label: ILabel;
  dataSet: IDataSet;
}

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const LabelInfo: React.FunctionComponent<TProps> = memo((props) => {
  const { className, user, index, label, dataSet } = props;

  const isSubscriptionImplemented = Subscription.implements(dataSet);

  const color = label.color || (dataSet as ISubscription).color;

  const style: React.CSSProperties = useMemo(() => ({
    borderColor: color,
    boxShadow: color && `${color} 0 0 0.5rem inset`
  }), [color]);

  return (
    <div className={classNames(className, styles.labelInfo)} style={style}>
      <div
        className={
          classNames(
            styles.reason,
            {
              [styles.empty]: !label.reason
            }
          )
        }
      >
        <EmoticonTranslator>
          {label.reason || TEXTS.LABEL_REASON_EMPTY_TEXT}
        </EmoticonTranslator>
      </div>
      <div className={styles.buttons}>
        {
          !isSubscriptionImplemented && (
            <EditLabelButton
              className={styles.button}
              user={user}
              index={index}
              label={label}
            />
          )
        }
        <LabelSourceButton
          className={styles.button}
          url={getShareURL(label)}
        />
        <LabelImageButton
          className={styles.button}
          label={label}
        />
        {
          !isSubscriptionImplemented ? (
            <RemoveLabelButton
              className={styles.button}
              user={user}
              index={index}
              label={label}
            />
          ) : (
            <LabelSubscriptionButton
              className={styles.button}
              subscription={dataSet}
            />
          )
        }
      </div>
    </div >
  );
});

LabelInfo.displayName = 'LabelInfo';

export default LabelInfo;
