import type React from 'react';
import Placeholder from '../../Placeholder/Placeholder';
import styles from './Loading.module.scss';

interface IProps { }

type TProps = IProps;

const Loading: React.FunctionComponent<TProps> = () => {
  return (
    <>
      <Placeholder className={styles.user} />
      <Placeholder className={styles.labelList} />
    </>
  );
};

Loading.displayName = 'Loading';

export default Loading;
