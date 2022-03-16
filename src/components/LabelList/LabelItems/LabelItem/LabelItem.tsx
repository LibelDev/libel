import { flip, useFloating } from '@floating-ui/react-dom';
import classNames from 'classnames';
import invert from 'invert-color';
import React, { useMemo } from 'react';
import Label from '../../../../models/Label';
import Personal from '../../../../models/Personal';
import Subscription from '../../../../models/Subscription';
import LabelInfo from './LabelInfo/LabelInfo';
import styles from './LabelItem.module.scss';

interface IProps {
  user?: string;
  index?: number;
  label: Label;
  color?: string;
  dataSet?: Personal | Subscription;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'div'>;

const LabelItem: React.FunctionComponent<TProps> = (props) => {
  const { className, user, index, label, color, dataSet } = props;

  const _color = label.color || color;

  const labelItemStyle: Partial<React.CSSProperties> | undefined = useMemo(() => (_color ? {
    backgroundColor: _color,
    borderColor: _color,
    color: _color && invert(_color, true)
  } : undefined), [_color]);

  const { x, y, reference, floating, strategy, update } = useFloating({
    strategy: 'fixed',
    placement: 'top',
    middleware: [flip()],
  });

  const labelInfoStyle = useMemo(() => ({
    position: strategy,
    top: y ?? '',
    left: x ?? '',
  }), [x, y, strategy]);

  return (
    <React.Fragment>
      <div
        ref={reference}
        className={classNames(className, styles.labelItem)}
        style={labelItemStyle}
        onMouseEnter={update}
      >
        {label.text}
      </div>
      {
        user && typeof index !== 'undefined' && label && dataSet && (
          <div ref={floating} className={styles.labelInfo} style={labelInfoStyle}>
            <LabelInfo
              user={user}
              index={index}
              label={label}
              color={_color}
              subscription={Subscription.implements(dataSet) ? dataSet : undefined}
            />
          </div>
        )
      }
    </React.Fragment>
  );
};

export default LabelItem;
