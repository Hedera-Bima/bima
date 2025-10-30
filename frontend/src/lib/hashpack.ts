/* eslint-disable @typescript-eslint/no-explicit-any */
// Minimal HashPack (HashConnect) integration helper
// Safely handles init in browser and connects to the HashPack extension.

let hashconnectInstance: any | null = null;
let initialized = false;
let pairingData: any | null = null;

const APP_METADATA = {
  name: 'Bima',
  description: 'Bima dApp',
  icon: (typeof window !== 'undefined' ? window.location.origin : '') + '/vite.svg',
} as const;

export type WalletConnection = {
  accountIds: string[];
  pairingTopic: string;
};

export async function connectHashpack(network: 'testnet' | 'mainnet' | 'previewnet' = 'testnet'): Promise<WalletConnection> {
  // Dynamic import to avoid SSR issues and to not break before dependency is installed
  const mod: any = await import('@hashgraph/hashconnect');
  const HashConnect = mod.HashConnect ?? mod.default?.HashConnect ?? mod.default;
  if (!HashConnect) {
    console.error('[HashPack] Could not resolve HashConnect class from @hashgraph/hashconnect module:', Object.keys(mod || {}));
    throw new Error('Incompatible @hashgraph/hashconnect package. Please ensure v1.x is installed.');
  }

  if (!hashconnectInstance) {
    hashconnectInstance = new HashConnect(true);
  }

  if (!initialized) {
    await hashconnectInstance.init(APP_METADATA, network, true);
    // Establish a connection session before attempting to pair with the local wallet
    try {
      await hashconnectInstance.connect();
    } catch (err) {
      console.error('[HashPack] connect() failed before pairing:', err);
    }
    initialized = true;
  }

  // If already paired, return existing data
  if (pairingData?.accountIds?.length) {
    return {
      accountIds: pairingData.accountIds,
      pairingTopic: pairingData.pairingTopic,
    };
  }

  // Optional: discover local wallets first (improves reliability with some versions)
  try {
    if (typeof hashconnectInstance.findLocalWallets === 'function') {
      await hashconnectInstance.findLocalWallets();
    }
  } catch (err) {
    console.warn('[HashPack] findLocalWallets() failed or unsupported:', err);
  }

  // This opens the HashPack extension if installed (local wallet)
  let newPairingData: any | null = null;
  try {
    newPairingData = await hashconnectInstance.connectToLocalWallet();
  } catch (err) {
    console.error('[HashPack] connectToLocalWallet() failed. Is the HashPack extension installed and enabled?', err);
    throw new Error('HashPack extension not detected or pairing failed. Please install/enable HashPack and try again.');
  }
  pairingData = newPairingData;

  if (!pairingData || !Array.isArray(pairingData.accountIds)) {
    throw new Error('HashPack pairing returned no accounts. Ensure the request was approved in the extension.');
  }

  return {
    accountIds: pairingData?.accountIds ?? [],
    pairingTopic: pairingData?.pairingTopic ?? '',
  };
}
