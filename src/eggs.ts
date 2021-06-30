import EasterEgg from './models/EasterEgg';
import styles from './stylesheets/lihkg.scss';

const eggs: EasterEgg[] = [
  new EasterEgg(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    if (month === 7 && date === 1) {
      const app = document.querySelector('#app');
      app!.classList.add(styles.handoverOfHongKong);
    }
  })
];

export default eggs;
