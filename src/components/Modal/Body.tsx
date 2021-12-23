import React, { useContext } from 'react';
import { MappedHTMLAttributes } from '../../helpers/types';
import styles from './Body.scss';
import IDsContext from './IDsContext';

interface IProps  { }

type TProps = IProps & MappedHTMLAttributes<'div'>

const Body: React.FunctionComponent<TProps> = (props) => {
  const { children } = props;
  const { body: id } = useContext(IDsContext);
  return (
    <div id={id} className={styles.body}>
      {children}
    </div>
  );
};

export default Body;
