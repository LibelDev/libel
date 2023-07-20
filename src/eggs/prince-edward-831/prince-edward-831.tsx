import { createRoot } from 'react-dom/client';
import Slideshow from '../../components/Slideshow/Slideshow';
import { observerForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgClasses from '../../stylesheets/variables/lihkg/classes.module.scss';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { caption, enabled, images, interval, referenceURL } from './config/config';
import styles from './prince-edward-831.module.scss';

/**
 * Prince Edward 831
 * @see https://zh.wikipedia.org/wiki/太子站襲擊事件
 * @see https://collection.news/thestandnews/articles/100620
 * @see https://collection.news/thestandnews/articles/100882
 * @see https://collection.news/thestandnews/articles/101392
 * @see https://collection.news/thestandnews/articles/101503
 * @see https://collection.news/thestandnews/articles/101901
 * @see https://collection.news/thestandnews/articles/101508
 * @see https://collection.news/thestandnews/articles/119218
 * @see https://web.archive.org/web/20221101072709/https://www.hkcnews.com/article/29919/監警會-831警察太子站打人-監警會報告-29929/【監警會評831太子站】警無差別打人、傷者47分鐘後10變7、特別列車送荔枝角-報告沒解釋
 * @see https://www.inmediahk.net/node/1076951
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
