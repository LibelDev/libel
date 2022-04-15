import { useCallback, useRef } from 'react';

type TUseFocusResult<T> = [
  React.MutableRefObject<T | null>,
  (options?: FocusOptions) => void
];

const useFocus = <T extends HTMLElement> (): TUseFocusResult<T> => {
  const ref = useRef<T | null>(null);
  const focus = useCallback((options?: FocusOptions) => {
    ref.current?.focus(options);
  }, [ref]);
  return [ref, focus];
};

export default useFocus;
