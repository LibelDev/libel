type TMaybePromise<T> = T | PromiseLike<T>;

class Singleton<T> {
  /**
   * the source of the singleton
   * @private
   */
  private source: T | PromiseLike<T>;
  /** 
   * the awaited value of the source
   * @private
   */
  private value!: T;

  constructor (source: T | PromiseLike<T>) {
    this.source = source;
  }

  get () {
    const { source, value } = this;
    if (isPromiseLike(source)) {
      return new Promise<T>(async (resolve) => {
        if (!value) {
          this.value = await source;
        }
        resolve(this.value);
      });
    }
    if (!value) {
      this.value = source;
    }
    return this.value;
  }
}

export default Singleton;

function isPromiseLike<T> (value: TMaybePromise<T>): value is PromiseLike<T> {
  return ('then' in value);
}
