import { useMemo } from 'react';
import { counter } from '../helpers/counter';

const count = counter();

const useCount = () => {
  return useMemo(() => count.next().value, []);
};

export default useCount;
