import type React from 'react';
import * as TEXTS from '../../constants/texts';
import { getElementLabelTipProps } from '../../helpers/common';
import { IconName } from '../Icon/types';
import IconLink from '../IconLink/IconLink';

interface IProps {
  url?: string;
}

type TComponentProps = React.ComponentPropsWithoutRef<'a'>;

type TProps = IProps & TComponentProps;

const LabelSourceButton: React.FunctionComponent<TProps> = (props) => {
  const { url, ...otherProps } = props;
  return url ? (
    <IconLink
      icon={IconName.Link}
      href={url}
      target="_blank"
      {...getElementLabelTipProps(TEXTS.BUTTON_TEXT_LABEL_SOURCE)}
      {...otherProps}
    />
  ) : null;
};

LabelSourceButton.displayName = 'LabelSourceButton';

export default LabelSourceButton;
