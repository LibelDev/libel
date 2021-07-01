export const insertAfter = (newChild: Node, referenceChild: Node) => {
  return referenceChild.parentNode?.insertBefore(newChild, referenceChild.nextSibling);
};

export const appendScript = (src: string) => {
  const script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);
};

export const waitForElement = (selector: string): Promise<Element> => {
  const element = document.querySelector(selector);
  if (element) {
    return Promise.resolve(element);
  }
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        switch (mutation.type) {
          case 'childList': {
            const nodes = Array.from(mutation.addedNodes);
            for (const node of nodes) {
              if (node.nodeType === document.ELEMENT_NODE) {
                if ((node as Element).matches(selector)) {
                  observer.disconnect();
                  return resolve(node as Element);
                }
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
