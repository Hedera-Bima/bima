import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
  services: {
    ipfs: 'configured' | 'not configured';
    hedera: 'configured' | 'not configured';
  } | null;
}

export function ConnectionStatus({ isConnected, error, services }: ConnectionStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="bg-card p-4 rounded-lg shadow-lg border border-border flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-destructive" />
          )}
          <span className="font-medium">
            Backend: {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {services && (
          <div className="flex items-center gap-3 border-l border-border pl-3">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">IPFS:</span>
              {services.ipfs === 'configured' ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Hedera:</span>
              {services.hedera === 'configured' ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-destructive ml-2"
          >
            {error}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}