import classNames from 'classnames';
import React from 'react';
import styles from './Badge.module.scss';

interface IProps {
  quantity: number;
}

type TProps = IProps & React.ComponentPropsWithRef<'span'>;

const Badge: React.FunctionComponent<TProps> = (props) => {
  const { className, quantity } = props;
  return quantity > 1 ? (
    <span className={classNames(className, styles.badge)}>
      {quantity}
    </span>
  ) : null;
};

Badge.displayName = 'Badge';

export default Badge;
