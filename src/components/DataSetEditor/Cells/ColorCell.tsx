import debugFactory from 'debug';
import React, { useCallback, useState } from 'react';
import { Key } from 'ts-key-enum';
import ColorPicker from '../../ColorPicker/ColorPicker';
import styles from './ColorCell.module.scss';

interface IProps {
  color?: string | null;
  onChange: (color: string | null) => void;
}

type TProps = IProps;

const debug = debugFactory('libel:component:ColorCell');

const ColorCell: React.FunctionComponent<TProps> = (props) => {
  const { color, onChange } = props;

  const [value, setValue] = useState(color || null);

  const updateValue = useCallback((value: string | null) => {
    setValue(value);
    onChange(value);
  }, [onChange]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { value } = event.target;
    updateValue(value);
  }, [updateValue]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
    const { key } = event;
    debug('handleKeyDown', key);
    switch (key) {
      case Key.Backspace:
      case Key.Delete: {
        updateValue(null);
        break;
      }
    }
  }, [updateValue]);

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
