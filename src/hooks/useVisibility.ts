import type React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

export module UseVisibility {
  /**
   * `useVisibility` hook options
   * @extends IntersectionObserverInit
   */
  export interface IOptions<T> extends IntersectionObserverInit {
    beforeChange?: TBeforeChangeEventHandler<T>;
  }
  /**
   * `useVisibility` hook result
   */
  export type TResult<T> = [React.RefObject<T>, boolean];
  /* event handlers */
  export type TBeforeChangeEventHandler<T> = (element: T, visible: boolean) => void;
}

const useVisibility = <T extends HTMLElement> (options: UseVisibility.IOptions<T> = {}): UseVisibility.TResult<T> => {
  const { root, rootMargin, threshold, beforeChange } = options;

  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (ref.current) {
      const options = { root, rootMargin, threshold };
      const observer = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          const { isIntersecting } = entry;
          if (beforeChange) {
            beforeChange(ref.current!, isIntersecting);
          }
          setVisible(isIntersecting);
        }
      }, options);

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [root, rootMargin, threshold, beforeChange]);

  return [ref, visible];
};

export default useVisibility;
