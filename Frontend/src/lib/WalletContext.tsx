import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { connectHashpack } from './hashpack';
import type { WalletConnection } from './hashpack';

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  accountIds: string[];
  activeAccount: string | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  setActiveAccount: (accountId: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [accountIds, setAccountIds] = useState<string[]>([]);
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const savedConnection = localStorage.getItem('walletConnection');
    if (savedConnection) {
      const connection = JSON.parse(savedConnection);
      setAccountIds(connection.accountIds);
      setActiveAccount(connection.accountIds[0]);
      setIsConnected(true);
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const connection: WalletConnection = await connectHashpack();
      setAccountIds(connection.accountIds);
      setActiveAccount(connection.accountIds[0]);
      setIsConnected(true);
      // Save connection data
      localStorage.setItem('walletConnection', JSON.stringify(connection));
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccountIds([]);
    setActiveAccount(null);
    localStorage.removeItem('walletConnection');
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        accountIds,
        activeAccount,
        error,
        connect,
        disconnect,
        setActiveAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}