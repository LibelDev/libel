import React, { useCallback } from 'react';
import { Key } from 'ts-key-enum';
import { IconName } from '../../Icon/types';
import TextInput, { TProps as TTextInputProps } from '../../TextInput/TextInput';

export interface IProps {
  onChange: (keyword: string) => void;
}

type TProps = IProps & Omit<TTextInputProps, 'onChange'>;

const Filter: React.FunctionComponent<TProps> = (props) => {
  const { onChange, ...otherProps } = props;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { value } = event.currentTarget;
    onChange(value);
  }, [onChange]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
    const { key } = event;
    if (key === Key.Enter) {
      event.preventDefault();
    }
  }, []);

  return (
    <TextInput
      {...otherProps}
      icon={IconName.Filter}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
};

Filter.displayName = 'Filter';

export default Filter;
