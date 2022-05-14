import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { enabled } from './config/config';
import styles from './revolution-of-our-times.module.scss';

/**
 * The Anti-Extradition Law Amendment Bill Movement
 * @see https://zh.wikipedia.org/wiki/反對逃犯條例修訂草案運動
 */
const hatch = async () => {
  const splitView = await waitForElement(lihkgSelectors.splitView);
  const leftPanel = splitView.querySelector(lihkgSelectors.leftPanel);
  const underlay = document.createElement('div');
  underlay.classList.add(styles.underlay);
  underlay.setAttribute('aria-hidden', 'true');
  leftPanel?.insertBefore(underlay, leftPanel.firstChild);
  const app = document.querySelector(lihkgSelectors.app);
  app?.classList.add(styles.egg);
};

const egg = new EasterEgg(hatch, enabled);

export default egg;
