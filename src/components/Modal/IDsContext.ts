import { createContext } from 'react';

interface IContext {
  title: string;
  body: string;
}

const Context = createContext<IContext>({
  title: '',
  body: ''
});

export default Context;
