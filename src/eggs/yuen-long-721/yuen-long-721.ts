import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { enabled } from './config/config';
import styles from './yuen-long-721.scss';

/**
 * Yuen Long 721
 * @see https://en.wikipedia.org/wiki/2019_Yuen_Long_attack
 * @see https://www.thestandnews.com/media/video/images/721-尋源
 * @see https://www.youtube.com/watch?v=5RWsXqjaads
 * @see https://www.youtube.com/watch?v=9e8OCzU_lAI
 */
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
