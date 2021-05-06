import classNames from 'classnames';
import React, { useMemo } from 'react';
import styles from './ToggleButton.scss';
import { counter } from '../../helpers/counter';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const idPrefix = 'toogle-button-';

const count = counter();

const ToggleButton: React.FunctionComponent<IProps> = (props) => {
  const { className, children, ...otherProps } = props;

  const id = useMemo(() => {
    const { value } = count.next();
    return `${idPrefix}${value}`;
  }, [count]);

  return (
    <div className={classNames(className, styles.toggleButton)}>
      <input id={id} type="checkbox" {...otherProps} />
      <label htmlFor={id}>
        <span>{children}</span>
      </label>
    </div>
  );
};

export default ToggleButton;
