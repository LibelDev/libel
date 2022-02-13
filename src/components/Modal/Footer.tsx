import React from 'react';
import styles from './Footer.scss';

interface IProps { }

type TProps = IProps & React.ComponentPropsWithoutRef<'div'>

const Footer: React.FunctionComponent<TProps> = (props) => {
  const { children } = props;
  return (
    <div className={styles.footer}>
      {children}
    </div>
  );
};

export default Footer;
