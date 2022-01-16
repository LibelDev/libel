export const create = <T extends unknown> (awaited: PromiseLike<T>) => {
  let ready = false;
  let value: T;
  return () => {
    return new Promise<T>(async (resolve) => {
      if (!ready) {
        value = await awaited;
        ready = true;
      }
      resolve(value);
    });
  };
};