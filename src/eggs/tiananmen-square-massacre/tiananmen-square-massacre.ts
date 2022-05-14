import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { enabled, referenceURL } from './config/config';
import styles from './tiananmen-square-massacre.module.scss';

/**
 * Tiananmen Square Massacre
 * @see https://zh.wikipedia.org/wiki/六四事件
 */
const hatch = async () => {
  const nav = await waitForElement(lihkgSelectors.nav);
  const navCategory = nav.querySelector(lihkgSelectors.navCategory)!;
  const link = document.createElement('a');
  link.classList.add(styles.link);
  link.setAttribute('href', referenceURL);
  link.setAttribute('target', '_blank');
  link.innerHTML = '🕯';
  navCategory.appendChild(link);
};

const egg = new EasterEgg(hatch, enabled);

export default egg;
