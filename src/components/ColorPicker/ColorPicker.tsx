import classNames from 'classnames';
import type React from 'react';
import BaseInput, { type TProps as TBaseInputProps } from '../BaseInput/BaseInput';
import styles from './ColorPicker.module.scss';

interface IProps {
  border?: boolean;
  rounded?: boolean;
}

export type TProps = IProps & TBaseInputProps;

const ColorPicker: React.FunctionComponent<TProps> = (props) => {
  const { border, rounded, className, ...otherProps } = props;
  return (
    <BaseInput
      {...otherProps}
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
      type="color"
    />
  );
};

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;
