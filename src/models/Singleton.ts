class Singleton<T> {
  private value: T | PromiseLike<T>;
  private awaited?: T;

  constructor (value: T | PromiseLike<T>) {
    this.value = value;
  }

  get () {
    const { value, awaited } = this;
    if (isPromiseLike(value)) {
      return new Promise<T>(async (resolve) => {
        if (!awaited) {
          this.awaited = await value;
        }
        resolve(this.awaited!);
      });
    }
    if (!awaited) {
      this.awaited = value;
    }
    return this.awaited!;
  }
}

export default Singleton;

function isPromiseLike<T> (value: T | PromiseLike<T>): value is PromiseLike<T> {
  return ('then' in value);
}
