import { createContext } from 'react';

export interface IValue {
  unpause: () => void;
  pause: () => void;
}

const Context = createContext<IValue | null>(null);

export default Context;
