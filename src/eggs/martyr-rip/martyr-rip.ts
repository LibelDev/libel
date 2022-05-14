import random from 'lodash/random';
import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { enabled, images, referenceURL } from './config/config';
import styles from './martyr-rip.module.scss';

/**
 * Martyr RIP
 * @see https://zh.wikipedia.org/zh-hk/銅鑼灣刺警案
 */
const hatch = async () => {
  const index = random(0, images.length - 1);
  const imageSrc = images[index];
  const nav = await waitForElement(lihkgSelectors.nav);
  const navCategory = nav.querySelector(lihkgSelectors.navCategory)!;
  const icon = document.createElement('img');
  icon.setAttribute('src', imageSrc);
  const link = document.createElement('a');
  link.classList.add(styles.link);
  link.setAttribute('href', referenceURL);
  link.setAttribute('target', '_blank');
  link.appendChild(icon);
  navCategory.appendChild(link);
};

const egg = new EasterEgg(hatch, enabled);

export default egg;
