import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.scss';
import { waitForElement } from './../../helpers/dom';
import styles from './handover-of-hongkong.scss';

const now = new Date();
const month = now.getMonth() + 1;
const date = now.getDate();
const enabled = (
  month === 7 &&
  date === 1
);

const hatch = async () => {
  const splitView = await waitForElement(lihkgSelectors.splitView);
  const leftPanel = splitView.querySelector(lihkgSelectors.leftPanel);
  const underlay = document.createElement('div');
  underlay.classList.add(styles.underlay);
  leftPanel?.insertBefore(underlay, leftPanel.firstChild);
  const app = document.querySelector(lihkgSelectors.app);
  app?.classList.add(styles.egg);
};

const egg = new EasterEgg(hatch, enabled);

export default egg;

/**
 * References
 * - https://en.wikipedia.org/wiki/Handover_of_Hong_Kong
 */
