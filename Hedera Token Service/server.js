import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { uploadFileToIPFS, uploadJSONToIPFS } from './uploadToIPFS.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { PrivateKey, AccountId, TokenId, TransferTransaction, Hbar, TokenAssociateTransaction, NftId } from '@hashgraph/sdk';
import { loadVerificationLog, saveVerificationLog, getLandEntryById, applyApproval } from './landService.js';
import { createClient } from './connect.js';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(express.json());

async function fetchJsonFromIPFS(cid) {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to fetch IPFS content: ${cid}`);
  return await r.json();
}

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

// IPFS: Upload a file
app.post('/ipfs/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const ipfsHash = await uploadFileToIPFS(req.file.path);
    fs.unlinkSync(req.file.path); // Cleanup temp
    res.json({ ipfsHash, status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// IPFS: Upload metadata JSON
app.post('/ipfs/upload-json', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({ error: 'No JSON data' });
    const ipfsHash = await uploadJSONToIPFS(req.body);
    res.json({ ipfsHash, status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helpers for safe JSON file I/O
function loadJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.trim()) return [];
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// POST /listings: Create listing and store directly on IPFS
app.post('/listings', async (req, res) => {
  try {
    const { metadataHash, sellerId, indexCid } = req.body;
    if (!metadataHash || !sellerId) {
      return res.status(400).json({ error: 'Both metadataHash and sellerId required' });
    }
    const listingsFile = path.join(process.cwd(), 'listings-log.json');
    let data = loadJsonSafe(listingsFile);
    const record = {
      listingId: Date.now(),
      metadataHash,
      sellerId,
      status: 'pending_verification',
      createdAt: new Date().toISOString()
    };
    try {
      const cidRes = await uploadJSONToIPFS(record);
      if (cidRes) record.ipfsCid = cidRes;
    } catch {}
    data.push(record);
    saveJson(listingsFile, data);
    let nextIndex = [];
    if (indexCid) {
      try {
        const current = await fetchJsonFromIPFS(indexCid);
        if (Array.isArray(current)) nextIndex = current;
      } catch {}
    }
    if (record.ipfsCid) nextIndex.push(record.ipfsCid);
    let newIndexCid = null;
    try {
      newIndexCid = await uploadJSONToIPFS(nextIndex);
    } catch {}
    res.json({ listingId: record.listingId, status: record.status, ipfsCid: record.ipfsCid, indexCid: newIndexCid || indexCid || null, message: 'Listing created successfully.' });
  } catch (error) {
    console.error('Error saving listing to IPFS:', error);
    res.status(500).json({ error: error.message || 'Failed to save listing to IPFS' });
  }
});

// NFT Routes
app.post('/nft/create', upload.array('documents'), async (req, res) => {
  try {
    const { metadataHash, size, price, location } = req.body;
    
    if (!metadataHash) {
      return res.status(400).json({ error: 'Metadata hash is required' });
    }

    // Load the verification log safely
    const verificationLog = loadVerificationLog();
    
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

    // Upload land entry snapshot to IPFS and attach CID (for auditing/indexing)
    try {
      const cidRes = await uploadJSONToIPFS(landEntry);
      if (cidRes) landEntry.ipfsCid = cidRes;
    } catch {}

    // Add to verification log
    verificationLog.push(landEntry);
    saveVerificationLog(verificationLog);

    // Return the land entry ID for tracking
    res.json({ 
      success: true, 
      landId: landEntry.landId,
      ipfsCid: landEntry.ipfsCid,
      message: 'Land parcel submitted for verification'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/listings/index', async (req, res) => {
  try {
    const { cid } = req.query;
    if (!cid) return res.status(400).json({ error: 'cid is required' });
    const arr = await fetchJsonFromIPFS(String(cid));
    if (!Array.isArray(arr)) return res.json({ items: [] });
    res.json({ items: arr });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/listings/by-index', async (req, res) => {
  try {
    const { cid } = req.query;
    if (!cid) return res.status(400).json({ error: 'cid is required' });
    const arr = await fetchJsonFromIPFS(String(cid));
    if (!Array.isArray(arr) || arr.length === 0) return res.json({ items: [] });
    const results = [];
    for (const c of arr) {
      try {
        const item = await fetchJsonFromIPFS(String(c));
        results.push({ ...item, ipfsCid: c });
      } catch {}
    }
    res.json({ items: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/nft/mint', async (req, res) => {
  try {
    const { mintNFT } = await import('./mintNFT.js');
    const { tokenId, metadata, metadataHash } = req.body || {};
    if (!tokenId && !process.env.TOKEN_ID) {
      return res.status(400).json({ error: 'tokenId is required (or set env TOKEN_ID)' });
    }
    if (!metadata && !metadataHash) {
      return res.status(400).json({ error: 'Provide metadata object or metadataHash' });
    }
    const result = await mintNFT({ tokenId, metadata, metadataHash });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verification: record an approval and auto-mint if now verified
app.post('/land/verify', async (req, res) => {
  try {
    const { landId, role, name } = req.body || {};
    if (!landId || !role || !name) {
      return res.status(400).json({ error: 'landId, role, and name are required' });
    }
    if (!['Chief', 'Surveyor'].includes(role)) {
      return res.status(400).json({ error: "role must be 'Chief' or 'Surveyor'" });
    }
    const log = loadVerificationLog();
    const entry = getLandEntryById(log, landId);
    if (!entry) return res.status(404).json({ error: 'Land entry not found' });

    applyApproval(entry, role, name);
    let autoMint = null;
    if (entry.verified && !entry.nftMinted) {
      const { mintNFT } = await import('./mintNFT.js');
      autoMint = await mintNFT({ tokenId: process.env.TOKEN_ID, metadataHash: entry.metadataHash });
      entry.nftMinted = true;
      entry.nftSerial = autoMint.serial;
      entry.status = 'minted';
    }
    saveVerificationLog(log);
    res.json({ success: true, verified: entry.verified, status: entry.status, autoMint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Browse parcels: optional status filter (pending, approved, minted)
app.get('/parcels', async (req, res) => {
  try {
    const { status } = req.query;
    const log = loadVerificationLog();
    const filtered = status ? log.filter((e) => e.status === status) : log;
    res.json({ count: filtered.length, items: filtered });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase: HBAR transfer from buyer to seller, NFT transfer from treasury to buyer
app.post('/market/purchase', async (req, res) => {
  try {
    const { landId, buyerId, buyerKey, sellerId, priceHbar } = req.body || {};
    if (!landId || !buyerId || !buyerKey || !sellerId || !priceHbar) {
      return res.status(400).json({ error: 'landId, buyerId, buyerKey, sellerId, priceHbar are required' });
    }
    const log = loadVerificationLog();
    const entry = getLandEntryById(log, landId);
    if (!entry || !entry.verified || !entry.nftMinted || !entry.nftSerial) {
      return res.status(400).json({ error: 'Parcel must be verified and minted before purchase' });
    }
    const tokenIdStr = process.env.TOKEN_ID;
    if (!tokenIdStr) return res.status(400).json({ error: 'TOKEN_ID not configured' });

    const client = createClient();
    const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
    const buyerAccount = AccountId.fromString(buyerId);
    const buyerPrivateKey = PrivateKey.fromString(buyerKey);
    const sellerAccount = AccountId.fromString(sellerId);
    const tokenId = TokenId.fromString(tokenIdStr);
    const nftId = new NftId(tokenId, Number(entry.nftSerial));

    // Ensure buyer associated to token
    try {
      const assocTx = await new TokenAssociateTransaction()
        .setAccountId(buyerAccount)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(buyerPrivateKey);
      await (await assocTx.execute(client)).getReceipt(client);
    } catch {}

    // Construct transfer: HBAR and NFT from operator (treasury) to buyer
    const tx = await new TransferTransaction()
      .addHbarTransfer(buyerAccount, new Hbar(-Number(priceHbar)))
      .addHbarTransfer(sellerAccount, new Hbar(Number(priceHbar)))
      .addNftTransfer(nftId, operatorId, buyerAccount)
      .freezeWith(client)
      .sign(buyerPrivateKey);

    const signedByOperator = await tx.sign(operatorKey);
    const resp = await signedByOperator.execute(client);
    const receipt = await resp.getReceipt(client);

    entry.status = 'sold';
    entry.soldAt = new Date().toISOString();
    entry.buyerId = buyerId;
    saveVerificationLog(log);

    res.json({ success: true, status: receipt.status.toString(), landId, nftSerial: entry.nftSerial });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// (removed legacy CLI-bridge /land/verify route)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});