import React from 'react';

export interface IValue {
  unpause: () => void;
  pause: () => void;
}

const Context = React.createContext<IValue | null>(null);

export default Context;
