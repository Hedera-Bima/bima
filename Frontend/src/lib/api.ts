import axios from 'axios';

 export const API_BASE_URL = 'http://localhost:3000'; // adjust this to your backend URL

export const api = {
  // Land NFT Related
  async createLandNFT(data: FormData) {
    const response = await axios.post(`${API_BASE_URL}/nft/create`, data);
    return response.data;
  },

  async mintLandNFT(tokenId: string, metadata: any) {
    const response = await axios.post(`${API_BASE_URL}/nft/mint`, { tokenId, metadata });
    return response.data;
  },

  // IPFS Related
  async uploadFileToIPFS(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/ipfs/upload`, formData);
    return response.data;
  },

  async uploadJSONToIPFS(jsonData: any) {
    const response = await axios.post(`${API_BASE_URL}/ipfs/upload-json`, jsonData);
    return response.data;
  },

  // Land Verification
  async verifyLand(verificationData: any) {
    const response = await axios.post(`${API_BASE_URL}/land/verify`, verificationData);
    return response.data;
  }
};