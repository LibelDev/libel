import React from 'react';
import * as TEXTS from '../../../../../../constants/texts';
import { MappedHTMLAttributes } from '../../../../../../helpers/types';
import Label from '../../../../../../models/Label';
import { IconName } from '../../../../../../types/icon';
import Icon from '../../../../../Icon/Icon';

interface IProps  {
  label: Label;
}

type TProps = IProps & MappedHTMLAttributes<'a'>

const LabelSourceButton: React.FunctionComponent<TProps> = (props) => {
  const { className, label } = props;
  const { sourceURL } = label;
  return sourceURL ? (
    <a
      className={className}
      href={sourceURL}
      target="_blank"
      aria-label={TEXTS.SOURCE_BUTTON_TEXT}
      data-tip={TEXTS.SOURCE_BUTTON_TEXT}
      title={TEXTS.SOURCE_BUTTON_TEXT}
    >
      <Icon icon={IconName.Link} />
    </a>
  ) : null;
};

export default LabelSourceButton;
