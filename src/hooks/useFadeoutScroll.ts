// import debugFactory from 'debug';
import { MutableRefObject, useMemo, useRef } from 'react';
import { useScroll } from 'react-use';

module UseFadeoutScroll {
  /**
   * `useFadeoutScroll` hook result
   */
  export type TResult<T> = [
    MutableRefObject<T | null>,
    React.CSSProperties
  ];
}

// const debug = debugFactory('libel:hook:useFadeoutScroll');

const useFadeoutScroll = <T extends HTMLElement> (fadingRate = 1): UseFadeoutScroll.TResult<T> => {
  const ref = useRef<T | null>(null);
  const { y } = useScroll(ref);
  const style = useMemo<React.CSSProperties>(() => {
    if (ref.current) {
      const { clientHeight, scrollHeight } = ref.current;
      const gradients: string[] = [];
      if (y > 0) {
        gradients.push('transparent 0%');
        gradients.push(`black ${((y / scrollHeight) * fadingRate) * 100}%`);
      }
      if ((scrollHeight - clientHeight) > y) {
        gradients.push(`black ${(1 - ((scrollHeight - clientHeight - y) / scrollHeight) * fadingRate) * 100}%`);
        gradients.push('transparent 100%');
      }
      if (gradients.length > 0) {
        const maskImage = `linear-gradient(${gradients.join(', ')})`;
        return { WebkitMaskImage: maskImage, maskImage };
      }
    }
    return {};
  }, [y, ref.current]);
  return [ref, style];
};

export default useFadeoutScroll;
