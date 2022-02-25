import classNames from 'classnames';
import React from 'react';
import BaseInput, { TProps as TBaseInputProps } from '../BaseInput/BaseInput';
import styles from './ColorPicker.module.scss';

interface IProps {
  border?: boolean;
  rounded?: boolean;
}

export type TProps = IProps & TBaseInputProps;

const ColorPicker: React.FunctionComponent<TProps> = (props) => {
  const { border, rounded, className, value = '', ...otherProps } = props;
  return (
    <div
      className={
        classNames(
          className,
          styles.colorPicker,
          {
            [styles.border]: border,
            [styles.rounded]: rounded
          }
        )
      }
    >
      <BaseInput
        {...otherProps}
        type="color"
        value={value}
      />
    </div>
  );
};

export default ColorPicker;
