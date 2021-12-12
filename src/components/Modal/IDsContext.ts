import React from 'react';

interface IContext {
  title: string;
  body: string;
}

const Context = React.createContext<IContext>({
  title: '',
  body: ''
});

export default Context;
