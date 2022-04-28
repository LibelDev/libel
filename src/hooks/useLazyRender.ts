import type React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

export module UseLazyRender {
  /**
   * `useLazyRender` hook options
   * @extends IntersectionObserverInit
   */
  export interface IOptions<T> extends IntersectionObserverInit {
    onVisibilityChange?: TVisibilityChangeEventHandler<T>;
  }
  /**
   * `useLazyRender` hook result
   */
  export type TResult<T> = [React.RefObject<T>, boolean];
  /* event handlers */
  export type TVisibilityChangeEventHandler<T> = (element: T, visible: boolean) => void;
}

const useLazyRender = <T extends HTMLElement> (options: UseLazyRender.IOptions<T> = {}): UseLazyRender.TResult<T> => {
  const { root, rootMargin, threshold, onVisibilityChange } = options;

  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

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
  }, [root, rootMargin, threshold, onVisibilityChange]);

  return [ref, visible];
};

export default useLazyRender;
