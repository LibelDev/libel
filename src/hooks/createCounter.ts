import { useMemo } from 'react';
import { counter } from '../helpers/counter';

function createCounter () {
  const count = counter();
  const useCount = () => {
    return useMemo(() => count.next().value, []);
  };
  return useCount;
}

export default createCounter;
