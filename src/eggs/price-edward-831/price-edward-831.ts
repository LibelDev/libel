import random from 'lodash/random';
import image01 from '../../../assets/images/831/01.jpg';
import image02 from '../../../assets/images/831/02.jpg';
import image03 from '../../../assets/images/831/03.png';
import image04 from '../../../assets/images/831/04.png';
import image05 from '../../../assets/images/831/05.jpg';
import image06 from '../../../assets/images/831/06.png';
import image07 from '../../../assets/images/831/07.jpg';
import image08 from '../../../assets/images/831/08.jpg';
import image09 from '../../../assets/images/831/09.png';
import image10 from '../../../assets/images/831/10.png';
import image11 from '../../../assets/images/831/11.jpg';
import image12 from '../../../assets/images/831/12.jpg';
import image13 from '../../../assets/images/831/13.png';
import image14 from '../../../assets/images/831/14.jpg';
import * as config from '../../../config/config';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.scss';
import { waitForElement } from './../../helpers/dom';
import styles from './price-edward-831.scss';

const imageSrcs = [
  image01,
  image02,
  image03,
  image04,
  image05,
  image06,
  image07,
  image08,
  image09,
  image10,
  image11,
  image12,
  image13,
  image14
];

const interval = 3000;

const egg = new EasterEgg(async () => {
  if (validate()) {
    const notice = await waitForElement(lihkgSelectors.notice);
    const image = notice.querySelector('img')!;

    const slideshow = document.createElement('a');
    slideshow.setAttribute('aria-label', '點擊以勾起更多記憶');
    slideshow.setAttribute('href', 'https://www.youtube.com/watch?v=vIau2kwxzZA&has_verified=1');
    slideshow.setAttribute('target', '_blank');
    slideshow.classList.add(styles.slideshow);

    const images: HTMLDivElement[] = [];
    for (const imageSrc of imageSrcs) {
      const image = document.createElement('div');
      image.setAttribute('aria-hidden', 'true');
      image.classList.add(styles.image);
      image.style.backgroundImage = `url(${imageSrc})`;
      slideshow.appendChild(image);
      images.push(image);
    }

    notice.insertBefore(slideshow, image);
    const html = document.querySelector('html')!;
    html.classList.add(styles.egg);

    image.classList.add(styles.hidden);
    startSlideshow(images);
  }
});

function startSlideshow (images: HTMLDivElement[]) {
  let activeIndex = updateActiveIndex(0);
  setInterval(() => {
    activeIndex = updateActiveIndex(activeIndex);
  }, interval);

  function updateActiveIndex (activeIndex: number) {
    images[activeIndex].classList.remove(styles.active);
    const _index = getRandomIndex(0, images.length - 1, activeIndex);
    images[_index].classList.add(styles.active);
    return _index;
  }

  function getRandomIndex (min: number, max: number, activeIndex: number): number {
    const index = random(min, max);
    if (index === activeIndex) {
      return getRandomIndex(min, max, activeIndex);
    }
    return index;
  }
}

function validate () {
  if (config.debugEgg) {
    return true;
  }
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const { pathname } = window.location;
  return (
    month === 8 &&
    date === 31 &&
    pathname === '/notice'
  );
}

export default egg;

/**
 * References
 * - https://zh.wikipedia.org/wiki/太子站襲擊事件
 * - https://www.thestandnews.com/politics/網傳-8-31-太子站有人喪生-醫管局-無死亡個案-19-人仍留院
 * - https://www.thestandnews.com/politics/少女太子站跪求港鐵公開-8-31-cctv-港鐵-片段會保留-3-年
 * - https://www.thestandnews.com/politics/教大學生會長入稟要求港鐵公開-831-cctv-法庭押後裁決
 * - https://www.thestandnews.com/politics/回應楊岳橋及三員工指控-消防處-補充或修正紀錄常見-有人一知半解-極度遺憾
 * - https://www.thestandnews.com/politics/831-太子站-未成年市民指遭警毆打-父親代入稟告一哥索償
 * - https://www.thestandnews.com/society/太子站-b1-出口今早圍封-鮮花被清走
 * - https://www.thestandnews.com/politics/油尖旺區議會討論-8-31-警指揮官-唔好再做謊言傳聲筒
 * - https://www.hkcnews.com/article/29919/監警會-831警察太子站打人-監警會報告-29929/【監警會評831太子站】警無差別打人、傷者47分鐘後10變7、特別列車送荔枝角-報告沒解釋
 * - https://www.hkcnews.com/article/33422/831警察太子站打人-警察暴力-33424/那一夜，由縱容恐襲變成發動恐襲
 */
