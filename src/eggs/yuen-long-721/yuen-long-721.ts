import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.scss';
import { waitForElement } from './../../helpers/dom';
import styles from './yuen-long-721.scss';

const egg = new EasterEgg(async () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  if (month === 7 && date === 21) {
    const splitView = await waitForElement(lihkgSelectors.splitView);
    const leftPanel = splitView.querySelector(lihkgSelectors.leftPanel);
    const underlay = document.createElement('div');
    underlay.classList.add(styles.underlay);
    leftPanel?.insertBefore(underlay, leftPanel.firstChild);
    const app = document.querySelector(lihkgSelectors.app);
    app?.classList.add(styles.yuenLong721);
  }
});

export default egg;
