import { create } from 'zustand';
import axios from 'axios';
import { API_BASE_URL } from './api';

interface BackendStatus {
  isConnected: boolean;
  lastChecked: string | null;
  services: {
    ipfs: 'configured' | 'not configured';
    hedera: 'configured' | 'not configured';
  } | null;
  error: string | null;
}

interface BackendStore extends BackendStatus {
  checkConnection: () => Promise<void>;
}

export const useBackendStore = create<BackendStore>((set) => ({
  isConnected: false,
  lastChecked: null,
  services: null,
  error: null,
  checkConnection: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      set({
        isConnected: true,
        lastChecked: new Date().toISOString(),
        services: response.data.services,
        error: null
      });
    } catch (err) {
      set({
        isConnected: false,
        lastChecked: new Date().toISOString(),
        services: null,
        error: err instanceof Error ? err.message : 'Failed to connect to backend'
      });
    }
  }
}));