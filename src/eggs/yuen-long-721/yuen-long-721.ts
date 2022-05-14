import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { enabled } from './config/config';
import styles from './yuen-long-721.module.scss';

/**
 * Yuen Long 721
 * @see https://zh.wikipedia.org/wiki/元朗襲擊事件
 * @see https://collection.news/thestandnews/articles/148161
 * @see https://collection.news/thestandnews/articles/148362
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
