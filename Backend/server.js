import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { uploadToIPFS, uploadJSONToIPFS } from './uploadToIPFS.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());

// Health Check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      ipfs: process.env.PINATA_API_KEY ? 'configured' : 'not configured',
      hedera: process.env.OPERATOR_ID ? 'configured' : 'not configured'
    }
  });
});

// IPFS Routes
app.post('/ipfs/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    const ipfsHash = await uploadToIPFS(req.file.path);
    res.json({ ipfsHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/ipfs/upload-json', async (req, res) => {
  try {
    console.log('Received metadata:', req.body);
    const ipfsHash = await uploadJSONToIPFS(req.body);
    console.log('Generated IPFS hash:', ipfsHash);
    res.json({ ipfsHash });
  } catch (error) {
    console.error('Error uploading JSON:', error);
    res.status(500).json({ error: error.message });
  }
});

// NFT Routes
app.post('/nft/create', upload.array('documents'), async (req, res) => {
  try {
    const { metadataHash, size, price, location } = req.body;
    
    if (!metadataHash) {
      return res.status(400).json({ error: 'Metadata hash is required' });
    }

    // Load the verification log
    const verificationLog = JSON.parse(fs.readFileSync('./verification-log.json', 'utf8'));
    
    // Create a new land entry
    const landEntry = {
      landId: Date.now(), // Use timestamp as temporary ID
      size,
      price,
      location,
      metadataHash,
      approvals: [],
      verified: false,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    // Add to verification log
    verificationLog.push(landEntry);
    fs.writeFileSync('./verification-log.json', JSON.stringify(verificationLog, null, 2));

    // Return the land entry ID for tracking
    res.json({ 
      success: true, 
      landId: landEntry.landId,
      message: 'Land parcel submitted for verification'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/nft/mint', async (req, res) => {
  try {
    // Import your NFT minting logic here
    const { mintNFT } = await import('./nftmint.js');
    const { tokenId, metadata } = req.body;
    const result = await mintNFT(tokenId, metadata);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Land Verification Route
app.post('/land/verify', async (req, res) => {
  try {
    const { verifyLand } = await import('./verifyLand.js');
    const result = await verifyLand(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});