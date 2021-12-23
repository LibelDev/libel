import React from 'react';
import * as TEXTS from '../../../../constants/texts';
import { MappedHTMLAttributes } from '../../../../helpers/types';
import Label from '../../../../models/Label';
import { IconName } from '../../../../types/icon';
import Icon from '../../../Icon/Icon';

interface IProps  {
  label: Label;
}

type TProps = IProps & MappedHTMLAttributes<'a'>

const LabelImageButton: React.FunctionComponent<TProps> = (props) => {
  const { className, label } = props;
  const { image } = label;
  return image ? (
    <a
      className={className}
      href={image}
      target="_blank"
      aria-label={TEXTS.IMAGE_BUTTON_TEXT}
      data-tip={TEXTS.IMAGE_BUTTON_TEXT}
      title={TEXTS.IMAGE_BUTTON_TEXT}
    >
      <Icon icon={IconName.Image} />
    </a>
  ) : null;
};

export default LabelImageButton;
