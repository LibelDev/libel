import React from 'react';
import * as TEXTS from '../../../../constants/texts';
import type { ILabel } from '../../../../models/Label';
import Icon from '../../../Icon/Icon';
import { IconName } from '../../../Icon/types';

interface IProps  {
  label: ILabel;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'a'>

const LabelImageButton: React.FunctionComponent<TProps> = (props) => {
  const { className, label } = props;
  const { image } = label;
  return image ? (
    <a
      className={className}
      href={image}
      target="_blank"
      aria-label={TEXTS.BUTTON_TEXT_LABEL_IMAGE}
      data-tip={TEXTS.BUTTON_TEXT_LABEL_IMAGE}
      title={TEXTS.BUTTON_TEXT_LABEL_IMAGE}
    >
      <Icon icon={IconName.Image} />
    </a>
  ) : null;
};

export default LabelImageButton;
