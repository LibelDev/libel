import type React from 'react';
import { Provider as StoreProvider, type ProviderProps as StoreProviderProps } from 'react-redux';
import { PersistGate, type PersistGateProps } from 'redux-persist/integration/react';
import { Context as ResponseCacheContext } from '../../hooks/useResponseCache';
import type Cache from '../../models/Cache';

/**
 * original props
 */
interface IProps {
  cache: Cache;
}

/**
 * component props
 */
type TComponentProps = {};

/**
 * `Provider` props
 */
type TProps = IProps & TComponentProps & StoreProviderProps & PersistGateProps;

const Provider: React.FunctionComponent<TProps> = (props) => {
  const {
    cache,
    /* StoreProviderProps */
    store, context,
    /* PersistGateProps */
    persistor, onBeforeLift, loading,
    /* common */
    children
  } = props;
  return (
    <StoreProvider store={store} context={context}>
      <PersistGate persistor={persistor} onBeforeLift={onBeforeLift} loading={loading}>
        <ResponseCacheContext.Provider value={cache}>
          {children}
        </ResponseCacheContext.Provider>
      </PersistGate>
    </StoreProvider>
  );
};

Provider.displayName = 'Provider';

export default Provider;
