import classNames from 'classnames';
import React, { useMemo } from 'react';
import useCount from '../../hooks/useCount';
import styles from './ToggleButton.scss';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const ToggleButton: React.FunctionComponent<IProps> = (props) => {
  const { className, children, ...otherProps } = props;

  const count = useCount();
  const id = useMemo(() => `${ToggleButton.displayName}-${count}`, [count]);

  return (
    <div className={classNames(className, styles.toggleButton)}>
      <input id={id} type="checkbox" {...otherProps} />
      <label htmlFor={id}>
        <span>{children}</span>
      </label>
    </div>
  );
};

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
