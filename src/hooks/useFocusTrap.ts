import { createContext, useContext } from 'react';

export interface IContextValue {
  unpause: () => void;
  pause: () => void;
}

export const Context = createContext<IContextValue | null>(null);

const useFocusTrap = () => {
  return useContext(Context);
};

export default useFocusTrap;
