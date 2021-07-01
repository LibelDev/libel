import { waitForElement } from './../../helpers/lihkg';
import EasterEgg from '../../models/EasterEgg';
import flowerIconSrc from '../../../assets/images/lihkg/emotes/flower.webp';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.scss';
import styles from './martyr-rip.scss';

const egg = new EasterEgg(async () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  if (month === 7) {
    const nav = await waitForElement(lihkgSelectors.nav);
    const navCategory = nav.querySelector(lihkgSelectors.navCategory)!;
    const flowerIcon = document.createElement('img');
    flowerIcon.classList.add(styles.flowerIcon);
    flowerIcon.setAttribute('src', flowerIconSrc);
    flowerIcon.setAttribute('alt', '毋忘義士');
    navCategory.appendChild(flowerIcon);
  }
});

export default egg;

// Reference: https://www.thestandnews.com/society/ab71%E9%8A%85%E9%91%BC%E7%81%A3%E8%AD%A6%E5%93%A1sogo%E5%A4%96%E7%96%91%E4%B8%AD%E5%88%80-%E6%B6%88%E6%81%AF%E6%8C%87%E6%87%B7%E7%96%91%E6%96%BD%E8%A5%B2%E7%94%B7%E5%86%8D%E7%94%A8%E5%88%80%E8%87%AA%E6%8F%92%E5%BF%83%E5%8F%A3%E5%80%92%E5%9C%B0
