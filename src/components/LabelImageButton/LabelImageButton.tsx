import type React from 'react';
import * as TEXTS from '../../constants/texts';
import { getElementLabelTipProps } from '../../helpers/common';
import type { ILabel } from '../../models/Label';
import { IconName } from '../Icon/types';
import IconLink from '../IconLink/IconLink';

interface IProps {
  label: ILabel;
}

type TComponentProps = React.ComponentPropsWithoutRef<'a'>;

type TProps = IProps & TComponentProps;

const LabelImageButton: React.FunctionComponent<TProps> = (props) => {
  const { label, ...otherProps } = props;
  const { image } = label;
  return image ? (
    <IconLink
      icon={IconName.Image}
      href={image}
      target="_blank"
      {...getElementLabelTipProps(TEXTS.BUTTON_TEXT_LABEL_IMAGE)}
      {...otherProps}
    />
  ) : null;
};

LabelImageButton.displayName = 'LabelImageButton';

export default LabelImageButton;
