import type React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

export namespace UseLazyRender {
  /**
   * `useLazyRender` hook options
   * @extends IntersectionObserverInit
   */
  export interface Options<T> extends IntersectionObserverInit {
    onVisibilityChange?: VisibilityChangeEventHandler<T>;
  }
  export type VisibilityChangeEventHandler<T> = (element: T, visible: boolean) => void;
  export type Result<T> = [React.RefObject<T>, boolean];
}

const useLazyRender = <T extends HTMLElement> (options: UseLazyRender.Options<T> = {}): UseLazyRender.Result<T> => {
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
