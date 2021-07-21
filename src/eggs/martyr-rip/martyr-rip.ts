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
  const now = new Date();
  const month = now.getMonth() + 1;
  if (config.debugEgg || month === 7) {
    const index = random(0, imageSrcs.length - 1);
    const imageSrc = imageSrcs[index];
    const nav = await waitForElement(lihkgSelectors.nav);
    const navCategory = nav.querySelector(lihkgSelectors.navCategory)!;
    const icon = document.createElement('img');
    icon.classList.add(styles.icon);
    icon.setAttribute('src', imageSrc);
    navCategory.appendChild(icon);
  }
});

export default egg;

/**
 * References
 * - https://www.thestandnews.com/society/ab71銅鑼灣警員sogo外疑中刀-消息指懷疑施襲男再用刀自插心口倒地
 */
