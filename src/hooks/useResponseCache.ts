import { createContext, useContext } from 'react';
import type Cache from '../models/Cache';

export const Context = createContext<Cache | null>(null);

const useResponseCache = () => {
  return useContext(Context);
};

export default useResponseCache;
