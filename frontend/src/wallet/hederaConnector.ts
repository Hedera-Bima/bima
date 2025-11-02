import { DAppConnector, HederaJsonRpcMethod, HederaSessionEvent, HederaChainId } from '@hashgraph/hedera-wallet-connect';
import { LedgerId } from '@hashgraph/sdk';

let dAppConnector: any | null = null;
let initialized = false;

const getProjectId = () => {
  const id = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined;
  if (!id || id.trim() === '') {
    throw new Error(
      'WalletConnect configuration error: VITE_WALLETCONNECT_PROJECT_ID is missing.\n' +
        'Add it to frontend/.env (e.g., VITE_WALLETCONNECT_PROJECT_ID=your_project_id) and restart the dev server.'
    );
  }
  return id;
};

const appMetadata = {
  name: 'BIMA DApp',
  description: 'BIMA Hedera WalletConnect Integration',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
  icons: ['https://avatars.githubusercontent.com/u/31002956'],
};

export async function initConnector() {
  if (initialized && dAppConnector) return dAppConnector;

  const projectId = getProjectId();
  const ledger = (import.meta.env.VITE_HEDERA_NETWORK || 'testnet').toLowerCase() === 'mainnet' ? LedgerId.MAINNET : LedgerId.TESTNET;

  const rpcMethods = Object.values(HederaJsonRpcMethod).filter((v) => typeof v === 'string') as string[];
  const sessionEvents = [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged].filter((v) => typeof v === 'string') as string[];
  const supportedChains = [HederaChainId.Mainnet, HederaChainId.Testnet];

  dAppConnector = new DAppConnector(
    appMetadata,
    ledger,
    projectId,
    rpcMethods,
    sessionEvents,
    supportedChains
  );

  try {
    await dAppConnector.init({ logger: 'error' });
  } catch (e) {
    console.error('DAppConnector.init failed:', e);
    throw e;
  }
  initialized = true;
  return dAppConnector;
}

export async function openConnectModal() {
  const connector = await initConnector();
  try {
    await connector.openModal();
  } catch (err) {
    console.error('openConnectModal failed:', err);
    throw err;
  }
  return connector;
}

export async function disconnect() {
  if (!dAppConnector) return;
  try {
    await dAppConnector.disconnect?.();
  } catch (e) {
    console.error('Disconnect error', e);
  }
}

export async function onSessionEvent(event: HederaSessionEvent, handler: (...args: any[]) => void) {
  try {
    const connector = await initConnector();
    connector.on?.(event, handler);
  } catch (e) {
    console.error('onSessionEvent error', e);
  }
}

export function getConnector() {
  return dAppConnector;
}
