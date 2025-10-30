import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

// ✅ Upload a FILE (e.g., land document PDF or image)
export async function uploadToIPFS(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const metadata = JSON.stringify({
      name: filePath.split("/").pop(),
      keyvalues: { purpose: "LandDocument" }
    });
    data.append("pinataMetadata", metadata);

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
      maxBodyLength: Infinity,
      headers: {
        ...data.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    const ipfsHash = res.data.IpfsHash;
    console.log(`📄 File uploaded to IPFS: ${ipfsHash}`);
    return ipfsHash;

  } catch (err) {
    console.error("❌ Error uploading file to IPFS:", err.response?.data || err.message);
    throw err;
  }
}

// ✅ Upload a JSON object (e.g., land metadata)
export async function uploadJSONToIPFS(jsonData) {
  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", jsonData, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    const ipfsHash = res.data.IpfsHash;
    console.log(`🧾 JSON metadata uploaded to IPFS: ${ipfsHash}`);
    return ipfsHash;

  } catch (err) {
    console.error("❌ Error uploading JSON to IPFS:", err.response?.data || err.message);
    throw err;
  }
}
