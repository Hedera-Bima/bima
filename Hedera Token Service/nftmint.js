import {
  TokenMintTransaction,
  Client,
  AccountId,
  PrivateKey,
} from "@hashgraph/sdk";
import dotenv from "dotenv";
import readline from "readline";
import fs from "fs";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./uploadToIPFS.js";

dotenv.config();

const client = Client.forTestnet().setOperator(
  AccountId.fromString(process.env.OPERATOR_ID),
  PrivateKey.fromString(process.env.OPERATOR_KEY)
);

const verificationLogFile = "./verification-log.json";
const nftLogFile = "./nft-log.json";
const TOKEN_ID = process.env.TOKEN_ID || "";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

function loadJSON(file) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    console.error(`❌ Could not parse ${file}`);
    return [];
  }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ✅ Paste your new main() function here:
async function main() {
  try {
    console.log("🌍 BIMA Land NFT Minting System\n");

    const landIdInput = await ask("Enter Land ID: ");
    const landId = parseInt(landIdInput.trim(), 10);

    // Load verification log
    const verificationLog = loadJSON(verificationLogFile);
    let entry = verificationLog.find(e => Number(e.landId) === landId);

    if (!entry) {
      console.log(`⚠️ Land ID ${landId} not found in verification log.`);
      console.log("📝 Logging new submission...");

      // Ask for missing land details
      const size = await ask("Enter Land Size (e.g., 1.2 acres): ");
      const price = await ask("Enter Price (e.g., 5000 USD): ");
      const location = await ask("Enter Location (e.g., -1.2833, 36.8167): ");
      const filePath = await ask("Enter path to document file: ");

      console.log("📤 Uploading document to IPFS...");
      const docHash = await uploadFileToIPFS(filePath);

      entry = {
        landId,
        size,
        price,
        location,
        docHash,
        approvals: [],
        verified: false,
        status: "pending"
      };

      verificationLog.push(entry);
      saveJSON(verificationLogFile, verificationLog);
      console.log("📝 New submission added. Awaiting verification.");
      rl.close();
      return;
    }

    // Check verification before minting
    if (!entry.verified) {
      console.log(`⛔ Land ID ${landId} is NOT verified yet!`);
      console.log("Both Chief and Surveyor must approve before minting.");
      rl.close();
      return;
    }

    // Proceed to mint
    console.log(`✅ Land ID ${landId} is verified. Proceeding to mint...`);
    console.log("📤 Uploading metadata to IPFS...");

    const metadata = {
      landId: entry.landId,
      size: entry.size,
      price: entry.price,
      location: entry.location,
      document: `https://gateway.pinata.cloud/ipfs/${entry.docHash}`,
    };

    const metadataHash = await uploadJSONToIPFS(metadata);

    const mintTx = new TokenMintTransaction()
      .setTokenId(TOKEN_ID)
      .addMetadata(Buffer.from(metadataHash))
      .freezeWith(client);

    const signTx = await mintTx.sign(PrivateKey.fromString(process.env.OPERATOR_KEY));
    const mintResponse = await signTx.execute(client);
    const receipt = await mintResponse.getReceipt(client);

    const serial = receipt.serials[0]?.toString() || "N/A";

    console.log("\n🎉 Land NFT Minted Successfully!");
    console.log("   Status:", receipt.status.toString());
    console.log("   Serial Number:", serial);
    console.log("   Metadata IPFS Hash:", metadataHash);
    console.log("   View Metadata:", `https://gateway.pinata.cloud/ipfs/${metadataHash}`);

    // Log NFT mint
    const nftLog = loadJSON(nftLogFile);
    nftLog.push({
      timestamp: new Date().toISOString(),
      landId,
      serial,
      metadataHash,
    });
    saveJSON(nftLogFile, nftLog);

    // Update verification log
    entry.nftMinted = true;
    entry.nftSerial = serial;
    entry.metadataHash = metadataHash;
    entry.status = "minted";
    saveJSON(verificationLogFile, verificationLog);

    console.log("🗒️ Mint logged and verification log updated.");
    rl.close();

  } catch (error) {
    console.error("❌ Error:", error.message);
    rl.close();
  }
}

// ✅ Keep this line at the bottom
main();
