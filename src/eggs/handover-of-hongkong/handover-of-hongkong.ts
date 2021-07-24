import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.scss';
import * as config from './../../../config/config';
import { waitForElement } from './../../helpers/dom';
import styles from './handover-of-hongkong.scss';

const egg = new EasterEgg(async () => {
  if (validate()) {
    const splitView = await waitForElement(lihkgSelectors.splitView);
    const leftPanel = splitView.querySelector(lihkgSelectors.leftPanel);
    const underlay = document.createElement('div');
    underlay.classList.add(styles.underlay);
    leftPanel?.insertBefore(underlay, leftPanel.firstChild);
    const app = document.querySelector(lihkgSelectors.app);
    app?.classList.add(styles.egg);
  }
});

function validate () {
  if (config.debugEgg) {
    return true;
  }
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  return (
    month === 7 &&
    date === 1
  );
}

export default egg;

/**
 * References
 * - https://en.wikipedia.org/wiki/Handover_of_Hong_Kong
 */
