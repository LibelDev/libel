import createCounter from './createCounter';

interface ICounts {
  [prefix: string]: ReturnType<typeof createCounter>;
}

const counts: ICounts = {};

const useElementID = (prefix: string) => {
  counts[prefix] = counts[prefix] || createCounter();
  const useCount = counts[prefix];
  const count = useCount();
  return `${prefix}-${count}`;
};

export default useElementID;
