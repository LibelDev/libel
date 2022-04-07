import classnames from 'classnames';
import React, { useMemo } from 'react';
import { getShareURL } from '../../helpers/label';
import type { IDataSet } from '../../models/DataSet';
import type { ILabel } from '../../models/Label';
import Subscription from '../../models/Subscription';
import EditLabelButton from '../EditLabelButton/EditLabelButton';
import LabelImageButton from '../LabelImageButton/LabelImageButton';
import LabelProviderIcon from '../LabelProviderButton/LabelProviderButton';
import LabelSourceButton from '../LabelSourceButton/LabelSourceButton';
import RemoveLabelButton from '../RemoveLabelButton/RemoveLabelButton';
import styles from './LabelInfo.module.scss';

interface IProps {
  user: string;
  index: number;
  label: ILabel;
  color?: string;
  dataSet?: IDataSet;
}

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const LabelInfo: React.FunctionComponent<TProps> = (props) => {
  const { className, user, index, label, color, dataSet } = props;

  const _color = label.color || color;

  const style: Partial<React.CSSProperties> | undefined = useMemo(() => (_color ? {
    borderColor: _color
  } : undefined), [_color]);

  const isSubscriptionImplemented = Subscription.implements(dataSet);

  return (
    <div
      className={classnames(className, styles.labelInfo)}
      style={style}
    >
      {
        label.reason && (
          <div className={styles.reason}>
            {label.reason}
          </div>
        )
      }
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
          isSubscriptionImplemented ? (
            <LabelProviderIcon
              className={styles.button}
              subscription={dataSet}
            />
          ) : (
            <RemoveLabelButton
              className={styles.button}
              user={user}
              index={index}
              label={label}
            />
          )
        }
      </div>
    </div>
  );
};

LabelInfo.displayName = 'LabelInfo';

export default LabelInfo;
