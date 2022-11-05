import React from 'react';
import { HOST } from '../../constants/lihkg';
import type { IIconMap } from '../../types/lihkg';

/**
 * original props
 */
interface IProps {
  code: string;
}

/**
 * component props
 */
type TComponentProps = TComponentPropsWithoutRef<'img', IProps>;

/**
 * `Emoticon` props
 */
export type TProps = IProps & TComponentProps;

let cache: Map<string, string>;

export const buildEmoticonCache = (iconMap: IIconMap) => {
  if (cache) { return cache; }
  cache = new Map<string, string>();
  for (const name in iconMap) {
    const iconSet = iconMap[name];
    const { icons } = iconSet;
    for (const filepath in icons) {
      const code = icons[filepath];
      cache.set(code, filepath);
    }
  }
  return cache;
};

const Emoticon: React.FunctionComponent<TProps> = (props) => {
  const { className, code, ...otherProps } = props;
  const filepath = cache.get(code);

  if (!filepath) {
    return <>{code}</>;
  }

  const src = `${HOST}/${filepath}`;
  return (
    <img
      className={className}
      src={src}
      alt={code}
      {...otherProps}
    />
  );
};

Emoticon.displayName = 'Emoticon';

export default Emoticon;
