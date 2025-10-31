import axios from 'axios';
import { API_BASE_URL } from '../lib/api';

export type BackendStatus = {
  isConnected: boolean;
  lastChecked: string | null;
  services: {
    ipfs: 'configured' | 'not configured';
    hedera: 'configured' | 'not configured';
  } | null;
  error: string | null;
};

export async function checkBackendStatus(): Promise<BackendStatus> {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return {
      isConnected: true,
      lastChecked: new Date().toISOString(),
      services: response.data.services,
      error: null,
    };
  } catch (err: any) {
    return {
      isConnected: false,
      lastChecked: new Date().toISOString(),
      services: null,
      error: err?.message || 'Failed to connect to backend',
    };
  }
}
