import { useEffect, useState } from 'react';

const useRollingNumber = (start: number, end: number, interval: number) => {
  const [number, setNumber] = useState(start);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const _number = number + 1;
      if (_number <= end) {
        setNumber(_number);
      } else {
        setNumber(0);
      }
    }, interval);
    return () => {
      window.clearInterval(timer);
    };
  }, [end, number]);

  return number;
};

export default useRollingNumber;
