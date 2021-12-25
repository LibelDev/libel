import classNames from 'classnames';
import invert from 'invert-color';
import React, { useMemo } from 'react';
import { MappedHTMLAttributes } from '../../../../helpers/types';
import Label from '../../../../models/Label';
import Personal from '../../../../models/Personal';
import Subscription from '../../../../models/Subscription';
import LabelInfo from '../../LabelInfo/LabelInfo';
import styles from './LabelItem.scss';

interface IProps {
  user?: string;
  label: Label;
  color?: string;
  dataSet?: Personal | Subscription;
  hasInfo?: boolean;
}

type TProps = IProps & MappedHTMLAttributes<'div'>;

const LabelItem: React.FunctionComponent<TProps> = (props) => {
  const { className, user, label, color, dataSet, hasInfo = true } = props;

  const _color = label.color || color;

  const style: Partial<React.CSSProperties> | undefined = useMemo(() => (_color ? {
    backgroundColor: _color,
    borderColor: _color,
    color: _color && invert(_color, true)
  } : undefined), [_color]);

  return (
    <div
      className={classNames(className, styles.labelItem)}
      style={style}
    >
      {label.text}
      {
        dataSet && user && label && hasInfo && (
          <LabelInfo
            className={styles.labelInfo}
            user={user}
            label={label}
            color={_color}
            subscription={Subscription.implements(dataSet) ? dataSet : undefined}
          />
        )
      }
    </div>
  );
};

export default LabelItem;
