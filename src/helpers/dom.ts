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

export const waitForElement = <T extends HTMLElement> (selector: string): Promise<T> => {
  const element = document.querySelector<T>(selector);
  if (element) {
    return Promise.resolve(element);
  }
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations, observer) => {
      for (const mutation of mutations) {
        switch (mutation.type) {
          case 'childList': {
            const nodes = Array.from(mutation.addedNodes);
            for (const node of nodes) {
              if (node.nodeType === document.ELEMENT_NODE) {
                window.requestAnimationFrame(() => {
                  if ((node as T).matches(selector)) {
                    observer.disconnect();
                    return resolve(node as T);
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
  });
};
