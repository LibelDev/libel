import type { Action, Store } from '@reduxjs/toolkit';
// import retry from './retry';

export interface IReactRootElement extends Element {
  _reactRootContainer: any;
}

export const findReduxStore = <S extends unknown, A extends Action> (root: IReactRootElement): Store<S, A> | null => {
  let base;
  try {
    base = root._reactRootContainer._internalRoot.current;
  } catch (err) {
    // do nothing
  }
  while (base) {
    try {
      const store = base.pendingProps.store || base.stateNode.store;
      if (store) {
        return store;
      }
    } catch (err) {
      // no store
    }
    base = base.child;
  }
  return null;
};
