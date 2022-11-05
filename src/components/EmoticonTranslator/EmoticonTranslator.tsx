import React from 'react';
import { escape } from '../../helpers/regex';
import useUnlockedIconMap from '../../hooks/useUnlockedIconMap';
import Emoticon, { buildEmoticonCache, TProps as TEmoticonProps } from '../Emoticon/Emoticon';
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
  const { className } = props;
  const iconMap = useUnlockedIconMap();
  if (iconMap && typeof node === 'string') {
    const cache = buildEmoticonCache(iconMap);
    const codes = Array.from(cache.keys());
    const pattern = `(${codes.map(escape).join('|')})`;
    const regex = new RegExp(pattern, 'g');
    const parts = node.split(regex);
    return parts.map((part, index) => (
      <Emoticon
        key={index}
        className={className}
        code={part}
      />
    ));
  }
  return node;
});

export default EmoticonTranslator;
