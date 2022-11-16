import { createContext, useContext } from 'react';
import type { IIconMap } from '../types/lihkg';

export const Context = createContext<IIconMap | null>(null);

const useUnlockedIconMap = () => {
  return useContext(Context);
};

export default useUnlockedIconMap;
