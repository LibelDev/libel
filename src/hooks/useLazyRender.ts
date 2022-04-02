import { RefObject, useLayoutEffect, useRef, useState } from 'react';

/**
 * `useLazyRender` hook options
 * @extends IntersectionObserverInit
 */
export interface IOptions<T> extends IntersectionObserverInit {
  onVisibilityChange?: (element: T, visible: boolean) => void;
}

type TUseLazyRenderResult<T> = [RefObject<T>, boolean];

const useLazyRender = <T extends HTMLElement> (options: IOptions<T> = {}): TUseLazyRenderResult<T> => {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  const { root, rootMargin, threshold, onVisibilityChange } = options;

  useLayoutEffect(() => {
    if (ref.current) {
      const options = { root, rootMargin, threshold };
      const observer = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          const { isIntersecting } = entry;
          if (onVisibilityChange) {
            onVisibilityChange(ref.current!, isIntersecting);
          }
          setVisible(isIntersecting);
        }
      }, options);

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [root, rootMargin, threshold, ref]);

  return [ref, visible];
};

export default useLazyRender;
