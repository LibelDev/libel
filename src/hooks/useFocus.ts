import { useCallback, useRef } from 'react';

module UseFocus {
  /**
   * `useFocus` hook result
   */
  export type TResult<T> = [
    React.RefObject<T>,
    (options?: FocusOptions) => void
  ];
}

const useFocus = <T extends HTMLElement> (): UseFocus.TResult<T> => {
  const ref = useRef<T>(null);
  const focus = useCallback((options?: FocusOptions) => {
    ref.current?.focus(options);
  }, [ref]);
  return [ref, focus];
};

export default useFocus;
