import type React from 'react';
import { useCallback } from 'react';
import { Key } from 'ts-key-enum';
import useFocus from '../../../hooks/useFocus';
import { IconName } from '../../Icon/types';
import TextInput, { TProps as TTextInputProps } from '../../TextInput/TextInput';

export interface IProps {
  onChange: (keyword: string) => void;
}

type TComponentProps = Omit<TTextInputProps, keyof IProps>;

type TProps = IProps & TComponentProps;

const Filter: React.FunctionComponent<TProps> = (props) => {
  const { onChange, ...otherProps } = props;

  const [ref, focus] = useFocus<HTMLInputElement>();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { value } = event.currentTarget;
    onChange(value);
  }, [onChange]);

  const handleClear: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    event.preventDefault();
    onChange('');
    focus();
  }, [onChange, focus]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
    const { key } = event;
    if (key === Key.Enter) {
      event.preventDefault();
    }
  }, []);

  return (
    <TextInput
      ref={ref}
      {...otherProps}
      icon={IconName.Filter}
      onChange={handleChange}
      onClear={handleClear}
      onKeyDown={handleKeyDown}
    />
  );
};

Filter.displayName = 'Filter';

export default Filter;
