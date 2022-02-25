import debugFactory from 'debug';
import React, { useCallback, useState } from 'react';
import { Key } from 'ts-key-enum';
import ColorPicker from '../../ColorPicker/ColorPicker';
import styles from './ColorCell.module.scss';

interface IProps {
  color?: string | null;
  onChange: (color?: string | null) => void;
}

type TProps = IProps;

const debug = debugFactory('libel:component:ColorCell');

const ColorCell: React.FunctionComponent<TProps> = (props) => {
  const { color, onChange } = props;

  const [value, setValue] = useState(color);

  const handleSetValue = useCallback((value: typeof color) => {
    setValue(value);
    onChange(value);
  }, [onChange]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { value } = event.target;
    handleSetValue(value);
  }, [handleSetValue]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
    const { key } = event;
    debug('handleKeyDown', key);
    switch (key) {
      case Key.Backspace:
      case Key.Delete: {
        handleSetValue(null);
        break;
      }
    }
  }, [handleSetValue]);

  return (
    <ColorPicker
      className={styles.colorPicker}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};


export default ColorCell;
