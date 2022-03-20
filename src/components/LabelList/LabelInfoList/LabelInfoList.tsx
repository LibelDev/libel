import classNames from 'classnames';
import React from 'react';
import type { IGroupedLabelItem } from '../../../types/label';
import LabelInfo from '../LabelInfo/LabelInfo';
import styles from './LabelInfoList.module.scss';

interface IProps {
  items: IGroupedLabelItem[];
}

type TProps = IProps & React.ComponentPropsWithoutRef<'ul'>;

const LabelInfoList = React.forwardRef<HTMLUListElement, TProps>((props, ref) => {
  const { className, items, ...otherProps } = props;
  return (
    <ul ref={ref} className={classNames(className, styles.labelInfoList)} {...otherProps}>
      {
        items.map((item, key) => {
          const { user, index, label, dataSet } = item;
          return (
            <li key={key}>
              <LabelInfo
                user={user}
                index={index}
                label={label}
                dataSet={dataSet}
              />
            </li>
          );
        })
      }
    </ul>
  );
});

export default LabelInfoList;
