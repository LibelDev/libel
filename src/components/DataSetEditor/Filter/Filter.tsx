import React, { useCallback } from 'react';
import { IconName } from '../../Icon/types';
import TextInput, { TProps as TTextInputProps } from '../../TextInput/TextInput';

export interface IProps {
  onChange: TBivarianceHack<(keyword: string) => void>;
}

type TProps = IProps & Omit<TTextInputProps, 'onChange'>;

const Filter: React.FunctionComponent<TProps> = (props) => {
  const { onChange, ...otherProps } = props;

  const handleKeywordChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { value } = event.currentTarget;
    onChange(value);
  }, []);

  return (
    <TextInput
      {...otherProps}
      icon={IconName.Filter}
      onChange={handleKeywordChange}
    />
  );
};

Filter.displayName = 'Filter';

export default Filter;
