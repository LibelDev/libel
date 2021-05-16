import React from 'react';
import * as TEXTS from '../../../../constants/texts';
import Label from '../../../../models/Label';
import Icon, { IconName } from '../../../Icon/Icon';

interface IProps extends React.HTMLAttributes<HTMLAnchorElement> {
  label: Label;
}

const LabelSourceButton: React.FunctionComponent<IProps> = (props) => {
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
