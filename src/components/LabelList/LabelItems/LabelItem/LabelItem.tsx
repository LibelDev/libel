import classNames from 'classnames';
import invert from 'invert-color';
import React, { useCallback } from 'react';
import { MappedHTMLAttributes } from '../../../../helpers/types';
import useDataSetThemeColorStyle from '../../../../hooks/useDataSetThemeColorStyle';
import Label from '../../../../models/Label';
import Personal from '../../../../models/Personal';
import Subscription from '../../../../models/Subscription';
import LabelInfo from '../../LabelInfo/LabelInfo';
import styles from './LabelItem.scss';

interface IProps {
  dataSet: Personal | Subscription;
  user: string;
  label: Label;
  index: number;
}

type TProps = IProps & MappedHTMLAttributes<'li'>;

const LabelItem: React.FunctionComponent<TProps> = (props) => {
  const { className, dataSet, label, user, index } = props;

  const dataSetThemeColorStyle = useDataSetThemeColorStyle(dataSet, useCallback((color) => ({
    backgroundColor: color,
    borderColor: color,
    color: invert(color, true)
  }), []));

  return (
    <li
      tabIndex={0}
      className={classNames(className, styles.labelItem)}
      style={dataSetThemeColorStyle}
    >
      {label.text}
      <LabelInfo
        className={styles.labelInfo}
        dataSet={dataSet}
        user={user}
        label={label}
        index={index}
      />
    </li>
  );
};

export default LabelItem;
