import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { enabled } from './config/config';
import styles from './marco-leung.module.scss';

/**
 * Marco Leung
 * @see https://zh.wikipedia.org/zh-hk/梁凌杰
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
