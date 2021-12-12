import React, { useContext } from 'react';
import styles from './Body.scss';
import IDsContext from './IDsContext';

interface IProps extends React.HTMLAttributes<HTMLDivElement> { }

const Body: React.FunctionComponent<IProps> = (props) => {
  const { children } = props;
  const { body: id } = useContext(IDsContext);
  return (
    <div id={id} className={styles.body}>
      {children}
    </div>
  );
};

export default Body;
