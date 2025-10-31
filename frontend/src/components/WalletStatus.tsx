import { motion } from 'framer-motion';
import { Wallet, LogOut, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';

type UseWalletReturn = {
  isConnected: boolean;
  isConnecting: boolean;
  accountIds: string[];
  activeAccount: string | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  setActiveAccount: (id: string) => void;
};

function useWallet(): UseWalletReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [accountIds, setAccountIds] = useState<string[]>([]);
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simple stubbed behavior: simulate connecting and provide fake accounts.
  const connect = () => {
    setIsConnecting(true);
    setError(null);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      const accounts = ['0x1234ABCD5678EF90', '0xDEADBEEFCAFEBABE'];
      setAccountIds(accounts);
      setActiveAccount(accounts[0]);
    }, 800);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccountIds([]);
    setActiveAccount(null);
  };

  return {
    isConnected,
    isConnecting,
    accountIds,
    activeAccount,
    error,
    connect,
    disconnect,
    setActiveAccount,
  };
}

type AccountDropdownProps = {
  accountIds: string[];
  activeAccount: string | null;
  onSelect: (id: string) => void;
  onDisconnect: () => void;
};

function AccountDropdown({ accountIds, activeAccount, onSelect, onDisconnect }: AccountDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
  <Button onClick={() => setOpen((s: boolean) => !s)} variant="outline" className="flex items-center gap-2">
        <Wallet className="w-4 h-4" />
        {activeAccount ? (
          <span className="font-mono">
            {activeAccount.slice(0, 4)}...{activeAccount.slice(-4)}
          </span>
        ) : (
          'Select Account'
        )}
        <ChevronDown className="w-4 h-4" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50">
          <div className="flex flex-col">
            {accountIds.map((accountId) => (
              <button
                key={accountId}
                className={`text-left px-3 py-2 hover:bg-muted/5 ${accountId === activeAccount ? 'bg-muted/5' : ''} font-mono`}
                onClick={() => { onSelect(accountId); setOpen(false); }}
              >
                {accountId === activeAccount && (
                  <CheckCircle2 className="w-4 h-4 inline mr-2 text-primary" />
                )}
                {accountId}
              </button>
            ))}

            <div className="border-t border-border" />
            <button
              className="text-left px-3 py-2 hover:bg-muted/5 text-destructive flex items-center gap-2"
              onClick={() => { onDisconnect(); setOpen(false); }}
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function WalletStatus() {
  const {
    isConnected,
    isConnecting,
    accountIds,
    activeAccount,
    error,
    connect,
    disconnect,
    setActiveAccount,
  } = useWallet();

  return (
    <div className="relative">
      {!isConnected ? (
        <Button
          onClick={connect}
          disabled={isConnecting}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </>
          )}
        </Button>
      ) : (
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Connected
          </motion.div>

          <AccountDropdown
            accountIds={accountIds}
            activeAccount={activeAccount}
            onSelect={setActiveAccount}
            onDisconnect={disconnect}
          />
        </div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
