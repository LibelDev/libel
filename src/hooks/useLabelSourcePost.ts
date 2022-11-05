import { createContext, useContext } from 'react';
import type { IPost } from '../types/lihkg';

export const Context = createContext<IPost | null>(null);

const useLabelSourcePost = () => {
  return useContext(Context);
};

export default useLabelSourcePost;
