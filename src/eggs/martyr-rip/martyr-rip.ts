import random from 'lodash/random';
import imageRipCat from '../../../assets/images/lihkg/emotes/rip/cat.webp';
import imageRipCow from '../../../assets/images/lihkg/emotes/rip/cow.webp';
import imageRipDog from '../../../assets/images/lihkg/emotes/rip/dog.webp';
import imageRipFlower from '../../../assets/images/lihkg/emotes/rip/flower.webp';
import imageRipMouse from '../../../assets/images/lihkg/emotes/rip/mouse.gif';
import imageRipPig from '../../../assets/images/lihkg/emotes/rip/pig.webp';
import * as config from '../../../config/config';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.scss';
import { waitForElement } from './../../helpers/dom';
import styles from './martyr-rip.scss';

const imageSrcs = [
  imageRipCat,
  imageRipCow,
  imageRipDog,
  imageRipFlower,
  imageRipMouse,
  imageRipPig
];

const egg = new EasterEgg(async () => {
  if (validate()) {
    const index = random(0, imageSrcs.length - 1);
    const imageSrc = imageSrcs[index];
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
  }
});

function validate () {
  if (config.debugEgg) {
    return true;
  }
  const now = new Date();
  const month = now.getMonth() + 1;
  return (
    month === 7
  );
}

export default egg;

/**
 * References
 * - https://zh.wikipedia.org/wiki/銅鑼灣刺警案
 */
