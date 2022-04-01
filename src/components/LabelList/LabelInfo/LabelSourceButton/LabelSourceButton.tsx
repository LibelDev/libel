import React from 'react';
import * as TEXTS from '../../../../constants/texts';
import Icon from '../../../Icon/Icon';
import { IconName } from '../../../Icon/types';

interface IProps {
  url?: string;
}

type TComponentProps = React.ComponentPropsWithoutRef<'a'>;

type TProps = IProps & TComponentProps;

const LabelSourceButton: React.FunctionComponent<TProps> = (props) => {
  const { url, ...otherProps } = props;
  return url ? (
    <a
      {...otherProps}
      href={url}
      target="_blank"
      aria-label={TEXTS.BUTTON_TEXT_LABEL_SOURCE}
      data-tip={TEXTS.BUTTON_TEXT_LABEL_SOURCE}
      title={TEXTS.BUTTON_TEXT_LABEL_SOURCE}
    >
      <Icon icon={IconName.Link} />
    </a>
  ) : null;
};

export default LabelSourceButton;
