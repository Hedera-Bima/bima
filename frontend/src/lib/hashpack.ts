/* eslint-disable @typescript-eslint/no-explicit-any */
// Minimal HashPack (HashConnect) integration helper
// Safely handles init in browser and connects to the HashPack extension.

let hashconnectInstance: any | null = null;
let initialized = false;
let pairingData: any | null = null;

const STORAGE_KEY = 'hashpack_pairing';

// HMR-safe singleton bindings on window to prevent duplicate instances/topics during Vite hot reload
declare global {
  interface Window {
    __bima_hashconnect?: any | null;
    __bima_hashconnect_initialized?: boolean;
    __bima_hashpack_pairing?: any | null;
  }
}

if (typeof window !== 'undefined') {
  if (window.__bima_hashconnect) hashconnectInstance = window.__bima_hashconnect;
  if (window.__bima_hashconnect_initialized) initialized = true;
  if (window.__bima_hashpack_pairing) pairingData = window.__bima_hashpack_pairing;
}

function loadPairingFromStorage(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePairingToStorage(data: any | null) {
  if (typeof window === 'undefined') return;
  try {
    if (data) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

function clearHashconnectPersist() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem('hashconnectData'); } catch {}
  try { window.localStorage.removeItem('hashconnectDataV2'); } catch {}
}

// Attempt to restore previously paired session (account display) without prompting
if (typeof window !== 'undefined') {
  const restored = loadPairingFromStorage();
  if (restored?.accountIds?.length) {
    pairingData = restored;
  }
}

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
  async function attemptConnect(retry: boolean): Promise<WalletConnection> {
    // Dynamic import to avoid SSR issues and to not break before dependency is installed
    const mod: any = await import('@hashgraph/hashconnect');
    const HashConnect = mod.HashConnect ?? mod.default?.HashConnect ?? mod.default;
    if (!HashConnect) {
      console.error('[HashPack] Could not resolve HashConnect class from @hashgraph/hashconnect module:', Object.keys(mod || {}));
      throw new Error('Incompatible @hashgraph/hashconnect package. Please ensure v1.x is installed.');
    }

    if (!hashconnectInstance) {
      hashconnectInstance = new HashConnect(true);
      if (typeof window !== 'undefined') window.__bima_hashconnect = hashconnectInstance;
    }

    if (!initialized) {
      await hashconnectInstance.init(APP_METADATA, network, true);
      try {
        await hashconnectInstance.connect();
      } catch (err) {
        console.error('[HashPack] connect() failed before pairing:', err);
      }
      initialized = true;
      if (typeof window !== 'undefined') window.__bima_hashconnect_initialized = true;
    }

    if (pairingData?.accountIds?.length) {
      return {
        accountIds: pairingData.accountIds,
        pairingTopic: pairingData.pairingTopic,
      };
    }

    try {
      if (typeof hashconnectInstance.findLocalWallets === 'function') {
        await hashconnectInstance.findLocalWallets();
      }
    } catch (err) {
      console.warn('[HashPack] findLocalWallets() failed or unsupported:', err);
    }

    let newPairingData: any | null = null;
    try {
      newPairingData = await hashconnectInstance.connectToLocalWallet();
    } catch (err: any) {
      console.error('[HashPack] connectToLocalWallet() failed. Is the HashPack extension installed and enabled?', err);
      throw new Error('HashPack extension not detected or pairing failed. Please install/enable HashPack and try again.');
    }
    pairingData = newPairingData;
    savePairingToStorage(pairingData);
    if (typeof window !== 'undefined') window.__bima_hashpack_pairing = pairingData;

    if (!pairingData || !Array.isArray(pairingData.accountIds)) {
      throw new Error('HashPack pairing returned no accounts. Ensure the request was approved in the extension.');
    }

    return {
      accountIds: pairingData?.accountIds ?? [],
      pairingTopic: pairingData?.pairingTopic ?? '',
    };
  }

  try {
    return await attemptConnect(false);
  } catch (err: any) {
    const msg = String(err?.message || err || '').toLowerCase();
    // If a decryption/key mismatch happens, clear persisted data and retry once
    if (msg.includes('invalid encrypted text') || msg.includes('decrypt')) {
      savePairingToStorage(null);
      clearHashconnectPersist();
      pairingData = null;
      if (typeof window !== 'undefined') window.__bima_hashpack_pairing = null;
      try {
        return await attemptConnect(true);
      } catch (err2) {
        throw err2;
      }
    }
    throw err;
  }
}

export function getConnectedAccount(): string | null {
  const acc = pairingData?.accountIds?.[0];
  return acc ?? null;
}

export function clearHashpackConnection() {
  pairingData = null;
  savePairingToStorage(null);
  clearHashconnectPersist();
  if (typeof window !== 'undefined') window.__bima_hashpack_pairing = null;
}
