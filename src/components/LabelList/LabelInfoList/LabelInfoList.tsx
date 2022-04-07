import classNames from 'classnames';
import React from 'react';
import type { TLabelsGroupItem } from '../../../helpers/labelList';
import { IRemoteSubscription } from '../../../models/Subscription';
import LabelInfo from '../../LabelInfo/LabelInfo';
import styles from './LabelInfoList.module.scss';

interface IProps {
  items: TLabelsGroupItem[];
}

type TComponentProps = React.ComponentPropsWithoutRef<'ul'>;

type TProps = IProps & TComponentProps;

const LabelInfoList = React.forwardRef<HTMLUListElement, TProps>((props, ref) => {
  const { className, items, ...otherProps } = props;
  return (
    <ul ref={ref} className={classNames(className, styles.labelInfoList)} {...otherProps}>
      {
        items.map((item) => {
          const [user, index, label, dataSet] = item;
          return (
            <li key={label.id}>
              <LabelInfo
                user={user}
                index={index}
                label={label}
                color={(dataSet as IRemoteSubscription).color}
                dataSet={dataSet}
              />
            </li>
          );
        })
      }
    </ul>
  );
});

LabelInfoList.displayName = 'LabelInfoList';

export default LabelInfoList;
