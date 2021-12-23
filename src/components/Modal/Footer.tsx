import React from 'react';
import { MappedHTMLAttributes } from '../../helpers/types';
import styles from './Footer.scss';

interface IProps { }

type TProps = IProps & MappedHTMLAttributes<'div'>

const Footer: React.FunctionComponent<TProps> = (props) => {
  const { children } = props;
  return (
    <div className={styles.footer}>
      {children}
    </div>
  );
};

export default Footer;
