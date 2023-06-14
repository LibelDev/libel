import debugFactory from 'debug';

const debug = debugFactory('libel:helpers:dom');

export const insertAfter = (newChild: Node, referenceChild: Node) => {
  return referenceChild.parentNode?.insertBefore(newChild, referenceChild.nextSibling);
};

const appendScript = (target: HTMLElement, src?: string, async = false) => {
  const script = document.createElement('script');
  target.appendChild(script);
  script.async = async;
  if (src) {
    script.src = src;
  }
  return script;
};

export const appendScriptToHead = (src?: string, async?: boolean) => {
  const head = document.querySelector('head')!;
  return appendScript(head, src, async);
};

export const appendScriptToBody = (src?: string, async?: boolean) => {
  const body = document.querySelector('body')!;
  return appendScript(body, src, async);
};

export const waitForElement = <T extends HTMLElement> (selector: string) => {
  return new Promise<T>((resolve) => {
    observerForElement<T>(selector, (element, observer) => {
      observer.disconnect();
      resolve(element);
    });
  });
};

export const observerForElement = <T extends HTMLElement> (selector: string, callback: (element: T, observer: MutationObserver) => void) => {
  const observer = new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      switch (mutation.type) {
        case 'childList': {
          const nodes = Array.from(mutation.addedNodes);
          debug('observerForElement: childList: addedNodes %O', nodes);
          for (const node of nodes) {
            if (node.nodeType === document.ELEMENT_NODE) {
              window.requestAnimationFrame(() => {
                const _node = node as T;
                const element = _node.matches(selector) ? _node : _node.querySelector<T>(selector);
                if (element) {
                  debug('observerForElement: found %s %O', selector, element);
                  callback(element, observer);
                }
              });
            }
          }
          break;
        }
      }
    }
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true
  });
  /* initial observation */
  const element = document.querySelector<T>(selector);
  if (element) {
    callback(element, observer);
  }
  return observer;
};
