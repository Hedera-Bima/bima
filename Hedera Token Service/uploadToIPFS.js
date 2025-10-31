import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

// uploadFileToIPFS: accepts file path, returns IPFS hash via Pinata
export async function uploadFileToIPFS(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const data = new FormData();
    data.append('file', fs.createReadStream(filePath));
    const metadata = JSON.stringify({ name: filePath.split('/').pop(), keyvalues: { purpose: 'LandDoc' } });
    data.append('pinataMetadata', metadata);
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        maxBodyLength: Infinity,
        headers: {
          ...data.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );
    return res.data.IpfsHash;
  } catch (err) {
    throw err;
  }
}

// uploadJSONToIPFS: accepts js object, returns IPFS hash via Pinata
export async function uploadJSONToIPFS(jsonData) {
  try {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', jsonData, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      }
    });
    return res.data.IpfsHash;
  } catch (err) {
    throw err;
  }
}
