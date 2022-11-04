import { createContext, useContext } from 'react';
import type { IPost } from '../types/lihkg';

export const Context = createContext<IPost | null>(null);

const useTargetPost = () => {
  return useContext(Context);
};

export default useTargetPost;
