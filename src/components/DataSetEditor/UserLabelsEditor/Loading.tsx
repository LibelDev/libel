import React from 'react';
import Placeholder from '../../Placeholder/Placeholder';
import styles from './Loading.module.scss';

interface IProps { }

type TProps = IProps;

const Loading: React.FunctionComponent<TProps> = () => {
  return (
    <React.Fragment>
      <Placeholder className={styles.user} />
      <Placeholder className={styles.labelList} />
    </React.Fragment>
  );
};

Loading.displayName = 'Loading';

export default Loading;
