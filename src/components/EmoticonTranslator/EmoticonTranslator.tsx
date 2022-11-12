import React from 'react';
import { escape } from '../../helpers/regex';
import { useEmoticonMap } from '../../hooks/useEmoticon';
import Emoticon, { TProps as TEmoticonProps } from '../Emoticon/Emoticon';
import { withTraverse } from '../Traverse/Traverse';

/**
 * original props
 */
interface IProps { }

/**
 * component props
 */
type TComponentProps = React.PropsWithChildren<IProps>;

/**
 * `EmoticonTranslator` props
 */
type TProps = IProps & TComponentProps & Omit<TEmoticonProps, 'code'>;

const EmoticonTranslator = withTraverse<TProps>((node, props) => {
  const { className, children, ...otherProps } = props;
  const emoticonMap = useEmoticonMap();
  if (emoticonMap && typeof node === 'string') {
    const codes = Array.from(emoticonMap.keys());
    const pattern = `(${codes.map(escape).join('|')})`;
    const regex = new RegExp(pattern, 'g');
    const parts = node.split(regex);
    return parts.map((part, index) => (
      <Emoticon
        key={index}
        className={className}
        code={part}
        {...otherProps}
      />
    ));
  }
  return node;
});

export default EmoticonTranslator;
