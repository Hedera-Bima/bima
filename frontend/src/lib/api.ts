import axios from "axios";

export const API_BASE_URL = "http://localhost:3000"; // adjust this to your backend URL

// Health check for Hedera service
async function isHederaServiceAvailable(): Promise<boolean> {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 2000,
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

export const api = {
  // Land NFT Related
  async createLandNFT(body: {
    metadataHash: string;
    size?: string;
    price?: string;
    location?: string;
  }) {
    // Check if Hedera service is available first
    const isAvailable = await isHederaServiceAvailable();
    if (!isAvailable) {
      throw new Error(
        "Hedera service is currently unavailable. Your listing will still be saved locally.",
      );
    }
    const response = await axios.post(`${API_BASE_URL}/nft/create`, body, {
      timeout: 10000,
    });
    return response.data;
  },

  async mintLandNFT(tokenId: string, metadata: any) {
    const response = await axios.post(`${API_BASE_URL}/nft/mint`, {
      tokenId,
      metadata,
    });
    return response.data;
  },

  // IPFS Related
  async uploadFileToIPFS(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_BASE_URL}/ipfs/upload`, formData, {
      timeout: 15000,
    });
    return response.data;
  },

  async uploadJSONToIPFS(jsonData: any) {
    const response = await axios.post(
      `${API_BASE_URL}/ipfs/upload-json`,
      jsonData,
      { timeout: 10000 },
    );
    return response.data;
  },

  // Land Verification
  async verifyLand(verificationData: any) {
    const tokenFromEnv =
      (import.meta as any).env?.VITE_TOKEN_ID || "0.0.7158415";
    const body = {
      tokenId: verificationData?.tokenId ?? tokenFromEnv,
      ...verificationData,
    };
    const response = await axios.post(`${API_BASE_URL}/land/verify`, body);
    return response.data;
  },

  // Listings / Parcels
  async createListing(metadataHash: string, sellerId: string) {
    const response = await axios.post(`${API_BASE_URL}/listings`, {
      metadataHash,
      sellerId,
    });
    return response.data;
  },

  async getParcels(status?: string) {
    const url = status
      ? `${API_BASE_URL}/parcels?status=${encodeURIComponent(status)}`
      : `${API_BASE_URL}/parcels`;
    const response = await axios.get(url);
    return response.data;
  },

  async updateParcel(
    landId: string | number,
    body: {
      metadataHash: string;
      size?: string;
      price?: string;
      location?: string;
      description?: string;
      coordinates?: any;
      features?: any;
      seller?: any;
    },
  ) {
    const response = await axios.patch(
      `${API_BASE_URL}/parcels/${landId}`,
      body,
    );
    return response.data;
  },

  async purchaseMarket(body: {
    landId: number;
    buyerId: string;
    buyerKey: string;
    sellerId: string;
    priceHbar: string;
  }) {
    const response = await axios.post(`${API_BASE_URL}/market/purchase`, body);
    return response.data;
  },

  // Sync listing to local 5000 backend
  async createLocalListing5000(formData: FormData) {
    const response = await axios.post(
      `http://localhost:5000/api/listings`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },
};
