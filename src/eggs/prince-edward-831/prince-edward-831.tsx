import { createRoot } from 'react-dom/client';
import Slideshow, { IImage as ISlideshowImage } from '../../components/Slideshow/Slideshow';
import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { caption, enabled, images, interval, videoURL } from './config/config';
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
 * @see https://www.hkcnews.com/article/29919/監警會-831警察太子站打人-監警會報告-29929/【監警會評831太子站】警無差別打人、傷者47分鐘後10變7、特別列車送荔枝角-報告沒解釋
 * @see https://www.inmediahk.net/node/1076951
 */
const hatch = async () => {
  const notice = await waitForElement(lihkgSelectors.notice);
  const noticeImage = notice.querySelector('img')!;
  const { height, width } = noticeImage.getBoundingClientRect();

  const html = document.querySelector('html')!;
  html.classList.add(styles.egg);

  const imageRatio = height / width * 100;
  const container = document.createElement('a');
  container.setAttribute('aria-label', caption);
  container.setAttribute('href', videoURL);
  container.setAttribute('target', '_blank');
  container.classList.add(styles.container);
  container.style.paddingTop = `${imageRatio}%`;

  notice.insertBefore(container, noticeImage);
  noticeImage.remove();

  const _images: ISlideshowImage[] = images.map((src) => ({ src }));
  const root = createRoot(container);
  root.render(
    <Slideshow
      className={styles.slideshow}
      images={_images}
      interval={interval}
      aria-hidden
    />
  );
};

const egg = new EasterEgg(hatch, enabled);

export default egg;
