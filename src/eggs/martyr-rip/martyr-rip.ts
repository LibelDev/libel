import random from 'lodash/random';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { waitForElement } from './../../helpers/dom';
import { enabled, images } from './config/config';
import styles from './martyr-rip.scss';

/**
 * Martyr RIP
 * @see https://zh.wikipedia.org/wiki/銅鑼灣刺警案
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
  link.setAttribute('href', 'https://zh.wikipedia.org/wiki/銅鑼灣刺警案');
  link.setAttribute('target', '_blank');
  link.appendChild(icon);
  navCategory.appendChild(link);
};

const egg = new EasterEgg(hatch, enabled);

export default egg;
