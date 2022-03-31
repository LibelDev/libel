import classNames from 'classnames';
import React from 'react';
import styles from './Footer.module.scss';

interface IProps { }

type TProps = IProps & React.ComponentPropsWithoutRef<'div'>;

const Footer: React.FunctionComponent<TProps> = (props) => {
  const { className, ...otherProps } = props;
  return (
    <div
      {...otherProps}
      className={
        classNames(
          className,
          styles.footer
        )
      }
    />
  );
};

export default Footer;
