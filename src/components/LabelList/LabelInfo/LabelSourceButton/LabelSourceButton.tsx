import React from 'react';
import * as TEXTS from '../../../../constants/texts';
import Label from '../../../../models/Label';
import { IconName } from '../../../../types/icon';
import Icon from '../../../Icon/Icon';

interface IProps {
  url?: string;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'a'>;

const LabelSourceButton: React.FunctionComponent<TProps> = (props) => {
  const { className, url } = props;
  return url ? (
    <a
      className={className}
      href={url}
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
