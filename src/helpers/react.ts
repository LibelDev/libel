import React from 'react';

export const findReactComponent = <T extends unknown> (element: any, traverseUp = 0): T | null => {
  const key = Object.keys(element).find((key) => key.startsWith('__reactInternalInstance$'))!;
  const fiber = element[key];
  if (!fiber) return null;
  // react <16
  if (fiber._currentElement) {
    let compFiber = fiber._currentElement._owner;
    for (let i = 0; i < traverseUp; i++) {
      compFiber = compFiber._currentElement._owner;
    }
    return compFiber._instance;
  }
  // react 16+
  const getComponentFiber = (fiber: any) => {
    // return fiber._debugOwner; // this also works, but is __DEV__ only
    let parentFiber = fiber.return;
    while (typeof parentFiber.type === 'string') {
      parentFiber = parentFiber.return;
    }
    return parentFiber;
  };
  let compFiber = getComponentFiber(fiber);
  for (let i = 0; i < traverseUp; i++) {
    compFiber = getComponentFiber(compFiber);
  }
  return compFiber.stateNode;
};
