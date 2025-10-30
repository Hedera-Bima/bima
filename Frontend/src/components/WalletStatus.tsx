import { motion } from 'framer-motion';
import { Wallet, LogOut, ChevronDown, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useWallet } from '../lib/WalletContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="flex items-center gap-2">
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
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {accountIds.map((accountId) => (
                <DropdownMenuItem
                  key={accountId}
                  onClick={() => setActiveAccount(accountId)}
                  className="font-mono"
                >
                  {accountId === activeAccount && (
                    <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                  )}
                  {accountId}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={disconnect}
                className="text-destructive focus:text-destructive flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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