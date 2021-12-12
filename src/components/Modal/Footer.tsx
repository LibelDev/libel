import React from 'react';
import styles from './Footer.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> { }

const Footer: React.FunctionComponent<IProps> = (props) => {
  const { children } = props;
  return (
    <div className={styles.footer}>
      {children}
    </div>
  );
};

export default Footer;
