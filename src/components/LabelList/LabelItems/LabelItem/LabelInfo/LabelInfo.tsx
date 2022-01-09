import classnames from 'classnames';
import React, { useMemo } from 'react';
import { MappedHTMLAttributes } from '../../../../../helpers/types';
import Label from '../../../../../models/Label';
import Subscription from '../../../../../models/Subscription';
import EditLabelButton from './EditLabelButton/EditLabelButton';
import LabelImageButton from './LabelImageButton/LabelImageButton';
import styles from './LabelInfo.scss';
import LabelProviderIcon from './LabelProviderIcon/LabelProviderIcon';
import LabelSourceButton from './LabelSourceButton/LabelSourceButton';
import RemoveLabelButton from './RemoveLabelButton/RemoveLabelButton';

interface IProps {
  user: string;
  label: Label;
  color?: string;
  subscription?: Subscription;
}

type TProps = IProps & MappedHTMLAttributes<'div'>;

const LabelInfo: React.FunctionComponent<TProps> = (props) => {
  const { className, user, label, color, subscription } = props;

  const _color = label.color || color;

  const style: Partial<React.CSSProperties> | undefined = useMemo(() => (_color ? {
    borderColor: _color
  } : undefined), [_color]);

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
          !subscription && (
            <EditLabelButton className={styles.button} user={user} label={label} />
          )
        }
        <LabelSourceButton className={styles.button} label={label} />
        <LabelImageButton className={styles.button} label={label} />
        {
          subscription ?
            <LabelProviderIcon className={styles.button} subscription={subscription} /> :
            <RemoveLabelButton className={styles.button} user={user} label={label} />
        }
      </div>
    </div>
  );
};

export default LabelInfo;
