import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.scss';
import * as config from './../../../config/config';
import { waitForElement } from './../../helpers/dom';
import styles from './handover-of-hongkong.scss';

const egg = new EasterEgg(async () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  if (config.debugEgg || (month === 7 && date === 1)) {
    const splitView = await waitForElement(lihkgSelectors.splitView);
    const leftPanel = splitView.querySelector(lihkgSelectors.leftPanel);
    const underlay = document.createElement('div');
    underlay.classList.add(styles.underlay);
    leftPanel?.insertBefore(underlay, leftPanel.firstChild);
    const app = document.querySelector(lihkgSelectors.app);
    app?.classList.add(styles.egg);
  }
});

export default egg;

/**
 * References
 * - https://en.wikipedia.org/wiki/Handover_of_Hong_Kong
 */
