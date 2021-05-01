import React from 'react';
import Icon, { IconName } from '../../../Icon/Icon';
import * as TEXTS from '../../../../constants/texts';
import { getSourceURL } from '../../../../helpers/label';
import { ILabel } from '../../../../models/Label';

interface IProps extends React.HTMLAttributes<HTMLAnchorElement> {
  label: ILabel;
}

const LabelSourceButton: React.FunctionComponent<IProps> = (props) => {
  const { className, label } = props;
  const href = getSourceURL(label);
  return href ? (
    <a
      className={className}
      href={href}
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
