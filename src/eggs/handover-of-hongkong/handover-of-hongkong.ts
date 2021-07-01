import EasterEgg from '../../models/EasterEgg';
import styles from './handover-of-hongkong.scss';

const egg = new EasterEgg(() => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  if (month === 7 && date === 1) {
    const app = document.querySelector('#app');
    app!.classList.add(styles.handoverOfHongKong);
  }
});

export default egg;

// Reference: https://en.wikipedia.org/wiki/Handover_of_Hong_Kong
