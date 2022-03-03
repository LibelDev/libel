export const deduplicate = <T> (items: T[]) => {
  const set = new Set(items);
  return [...set];
};
