import { createRoot } from 'react-dom/client';
import Slideshow from '../../components/Slideshow/Slideshow';
import { observerForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgClasses from '../../stylesheets/variables/lihkg/classes.module.scss';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { caption, enabled, images, interval, referenceURL } from './config/config';
import styles from './yuen-long-721.module.scss';

/**
 * Yuen Long 721
 * @see https://theinitium.com/article/20190723-hongkong-yuenlong-incident-timeline/
 * @see https://www.hkcnews.com/antielab-conflicts/721/721.html
 * @see https://www.bbc.com/zhongwen/trad/chinese-news-57526233
 * @see https://www.bbc.com/zhongwen/trad/chinese-news-49070742
 * @see https://www.rfa.org/mandarin/yataibaodao/gangtai/al1-07222019064649.html
 * @see https://zh.wikipedia.org/zh-hk/元朗襲擊事件
 */
const hatch = async () => {
  observerForElement(lihkgSelectors.newFeaturesBoard, (board) => {
    const egg = document.createElement('a');
    egg.setAttribute('aria-label', caption);
    egg.setAttribute('href', referenceURL);
    egg.setAttribute('target', '_blank');
    egg.classList.add(lihkgClasses.newFeature);
    egg.classList.add(styles.egg);
    board.insertBefore(egg, board.firstChild);
    render(egg, images);
  });
};

const render = (egg: HTMLElement, images: string[]) => {
  const root = createRoot(egg);
  root.render(
    <Slideshow
      className={styles.slideshow}
      images={images.map((src) => ({ src }))}
      interval={interval}
    />
  );
};

const egg = new EasterEgg(hatch, enabled);

export default egg;
