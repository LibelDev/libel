type TAnyFunction = (...any: any[]) => any;
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

const sleep = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const retry = <A extends TAnyFunction> (action: A, maxAttempts = 10, delayTime = 500) => {
  let attempts = 0;
  const attempt = async (...args: Parameters<A>): Promise<Awaited<ReturnType<A>>> => {
    try {
      return await action(...args);
    } catch (err) {
      attempts = attempts + 1;
      if (attempts > maxAttempts) {
        throw err;
      }
      console.error(err);
      console.log(`Retry ${action.name} ${attempts} times after delaying ${delayTime}ms`);
      await sleep(delayTime);
      return await attempt(...args);
    }
  };
  return attempt;
};

export default retry;
