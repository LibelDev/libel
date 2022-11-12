import type React from 'react';
import { useCallback, useEffect } from 'react';
import * as TEXTS from '../../constants/texts';
import { getElementLabelTipProps } from '../../helpers/common';
import useSourcePostScreenshot from '../../hooks/useSourcePostScreenshot';
import { IPost } from '../../types/lihkg';
import { IconName } from '../Icon/types';
import IconButton from '../IconButton/IconButton';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './SourcePostScreenshotButton.module.scss';

/**
 * original props
 */
interface IProps {
  post: IPost;
}

/**
 * component props for the element type `button`
 */
type TComponentProps = React.ComponentPropsWithoutRef<'button'>;

/**
 * `SourcePostScreenshotButton` props
 */
type TProps = IProps & TComponentProps;

const SourcePostScreenshotButton: React.FunctionComponent<TProps> = (props) => {
  const { className, post, ...otherProps } = props;

  const [screenshot, capture] = useSourcePostScreenshot(post);

  const handleClick = useCallback(() => capture(), [capture]);

  useEffect(() => {
    if (!screenshot.loading && screenshot.url) {
      window.open(screenshot.url, '_blank');
    }
  }, [screenshot]);


  if (screenshot.loading) {
    return (
      <LoadingSpinner
        className={className}
        {...getElementLabelTipProps(TEXTS.SOURCE_PORT_SCREENSHOT_BUTTON_TEXT)}
      />
    );
  }

  return (
    <IconButton
      className={className}
      icon={IconName.Image}
      onClick={handleClick}
      {...getElementLabelTipProps(TEXTS.SOURCE_PORT_SCREENSHOT_BUTTON_TEXT)}
      {...otherProps}
    />
  );
};

SourcePostScreenshotButton.displayName = 'SourcePostScreenshotButton';

export default SourcePostScreenshotButton;

export { styles };
