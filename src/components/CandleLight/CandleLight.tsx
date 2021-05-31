import React from 'react';
import styles from './CandleLight.scss';

const CandleLight = () => {
  return (
    <div aria-hidden={true} className={styles.candle}>
      <div className={styles.flame}>
        <div className={styles.shadows}></div>
        <div className={styles.top}></div>
        <div className={styles.bottom}></div>
      </div>
      <div className={styles.wick}></div>
      <div className={styles.wax}></div>
    </div>
  );
}

export default CandleLight;

export { styles };
