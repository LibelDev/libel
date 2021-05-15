import { useEffect, RefObject } from 'react';

const useRemoveParentElement = <T extends HTMLElement> (ref: RefObject<T>, enabled: boolean) => {
  useEffect(() => {
    if (enabled) {
      ref.current?.parentElement?.remove();
    }
  }, [enabled]);
};

export default useRemoveParentElement;
