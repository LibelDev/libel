export const intercept = <K extends keyof XMLHttpRequestEventMap> (type: K, listener: (this: XMLHttpRequest, event: XMLHttpRequestEventMap[K]) => any) => {
  const _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (this: XMLHttpRequest) {
    this.addEventListener(type, listener.bind(this));
    type Arguments = Parameters<typeof _open>;
    return _open.apply(this, arguments as unknown as Arguments);
  };
};
