import { createContext, useContext } from 'react';

interface IContextValue {
  ids: {
    title: string;
    body: string;
  };
  onClose: () => void;
}

export const Context = createContext<IContextValue>({
  ids: {
    title: '',
    body: ''
  },
  onClose: () => { }
});

const useModal = () => {
  return useContext(Context);
};

export default useModal;
