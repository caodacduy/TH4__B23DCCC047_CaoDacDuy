import React, { createContext, useContext } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useOutboxSync } from '../hooks/useOutboxSync';

const SyncContext = createContext({
  isOnline: true,
  pendingCount: 0,
  syncing: false,
  syncNow: async () => {},
});

export function SyncProvider({ children, onSyncCompleted }) {
  const { isOnline } = useNetworkStatus();
  const { pendingCount, syncing, syncNow } = useOutboxSync(onSyncCompleted);

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        pendingCount,
        syncing,
        syncNow,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync phải được sử dụng bên trong SyncProvider');
  }
  return context;
}

export default SyncContext;

