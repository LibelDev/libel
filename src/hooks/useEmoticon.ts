import mem from 'mem';
import { HOST } from '../constants/lihkg';
import type { IIconMap } from '../types/lihkg';
import useUnlockedIconMap from './useUnlockedIconMap';

const buildEmoticonMap = (iconMap: IIconMap) => {
  const map = new Map<string, string>();
  for (const name in iconMap) {
    const iconSet = iconMap[name];
    const { icons } = iconSet;
    for (const url in icons) {
      const code = icons[url];
      map.set(code, url);
    }
  }
  return map;
};

const getEmoticonMap = mem((iconMap: IIconMap | null) => {
  if (!iconMap) { return null; }
  return buildEmoticonMap(iconMap);
});

export const useEmoticonMap = () => {
  const iconMap = useUnlockedIconMap();
  return getEmoticonMap(iconMap);
};

const useEmoticon = (code: string) => {
  const cache = useEmoticonMap();
  const url = cache?.get(code);
  return url && `${HOST}/${url}`;
};

export default useEmoticon;
