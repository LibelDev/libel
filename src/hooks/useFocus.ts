import { useCallback, useRef } from 'react';

type TUseFocusResult<T> = [
  React.RefObject<T>,
  (options?: FocusOptions) => void
];

const useFocus = <T extends HTMLElement> (): TUseFocusResult<T> => {
  const ref = useRef<T>(null);
  const focus = useCallback((options?: FocusOptions) => {
    ref.current?.focus(options);
  }, [ref]);
  return [ref, focus];
};

export default useFocus;
