import { useMemo } from 'react';
import { imageProxyURL } from '../../config/config';
import { SCREENSHOT_WIDTH } from '../constants/label';
import { isMobileMode } from '../helpers/app';
import * as LIHKG from '../helpers/lihkg';
import lihkgSelectors from '../stylesheets/variables/lihkg/selectors.module.scss';
import { IPost } from '../types/lihkg';
import useScreenshot, { type TOptions as TUseScreenshotOptions } from './useScreenshot';
import styles from './useSourcePostScreenshot.module.scss';

const options: TUseScreenshotOptions = {
  proxy: imageProxyURL,
  onclone: (document, element) => {
    const app = document.querySelector(lihkgSelectors.app)!;
    app.classList.add(styles.screenshot);
    if (!isMobileMode()) {
      element.style.width = `${SCREENSHOT_WIDTH}px`;
    }
  }
};

const useSourcePostScreenshot = (post: IPost | null) => {
  const threadTitleBar = document.querySelector<HTMLDivElement>(lihkgSelectors.threadTitleBar)!;
  const replyItemInner = post && LIHKG.getReplyItemInnerElementByPostId(post.post_id);
  const elements = useMemo(() => [threadTitleBar, replyItemInner!], [threadTitleBar, replyItemInner]);
  return useScreenshot(elements, options);
};

export default useSourcePostScreenshot;
