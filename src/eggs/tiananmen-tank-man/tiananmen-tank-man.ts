import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { enabled, videoURL } from './config/config';
import styles from './tiananmen-tank-man.module.scss';

/**
 * Tiananmen Tank Man
 * @see https://www.nytimes.com/2019/06/03/world/asia/tiananmen-tank-man.html
 */
const hatch = async () => {
  const notice = await waitForElement(lihkgSelectors.notice);
  const noticeImage = notice.querySelector('img')!;
  const { height, width } = noticeImage.getBoundingClientRect();

  const html = document.querySelector('html')!;
  html.classList.add(styles.egg);

  const imageRatio = height / width * 100;
  const image = document.createElement('a');
  image.setAttribute('href', videoURL);
  image.setAttribute('target', '_blank');
  image.classList.add(styles.image);
  image.style.paddingTop = `${imageRatio}%`;

  notice.insertBefore(image, noticeImage);
  noticeImage.remove();
};

const egg = new EasterEgg(hatch, enabled);

export default egg;
