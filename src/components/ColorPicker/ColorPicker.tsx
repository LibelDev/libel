import classNames from 'classnames';
import React from 'react';
import BaseInput, { TProps as TBaseInputProps } from '../BaseInput/BaseInput';
import styles from './ColorPicker.scss';

interface IProps { }

type TProps = IProps & TBaseInputProps;

const ColorPicker: React.FunctionComponent<TProps> = (props) => {
  const { className, ...otherProps } = props;
  return (
    <div className={classNames(className, styles.colorPicker)}>
      <BaseInput
        {...otherProps}
        type="color"
      />
    </div>
  );
};

export default ColorPicker;
