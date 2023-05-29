import { waitForElement } from '../../helpers/dom';
import EasterEgg from '../../models/EasterEgg';
import lihkgClasses from '../../stylesheets/variables/lihkg/classes.module.scss';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { caption, enabled, videoURL } from './config/config';
import styles from './tiananmen-tank-man.module.scss';

/**
 * Tiananmen Tank Man
 * @see https://www.nytimes.com/2019/06/03/world/asia/tiananmen-tank-man.html
 */
const hatch = async () => {
  const board = await waitForElement(lihkgSelectors.newFeaturesBoard);
  const egg = document.createElement('a');
  egg.setAttribute('aria-label', caption);
  egg.setAttribute('href', videoURL);
  egg.setAttribute('target', '_blank');
  egg.classList.add(lihkgClasses.newFeature);
  egg.classList.add(styles.egg);
  board.insertBefore(egg, board.firstChild);
};

const egg = new EasterEgg(hatch, enabled);

export default egg;
