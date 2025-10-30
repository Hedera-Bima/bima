#🏞️ BIMA: Decentralized Land Marketplace
Track: Web3 for Social Impact / Real-World Asset Tokenization
Status: ✅ Active  Build: Passing  License: MIT

##🌍 Overview

BIMA is a decentralized marketplace for buying, selling, and verifying land ownership using blockchain technology.
Deployed on the Hedera public ledger, it leverages tokenized land titles (NFTs), Decentralized Identifiers (DIDs), and smart contracts to bring trust, transparency, and speed to land transactions — especially in regions where property systems are opaque and prone to fraud.

>🌐 Live Demo:

##✨ Key Features

###🏠 Land Marketplace & Discovery
- **Browse verified land listings with price, size, and location.
- **Filter by verified status and inspector credibility.
-** On-chain proof of authenticity for each listing.

###🧾 Land Verification
-**Dual-signature (multi-sig) verification by Chiefs, Surveyors, and Land Officers.
-**Immutable on-chain logs of all approvals and submissions.
-**Reputation NFTs (Bronze, Silver, Gold) for inspector performance.

###💰 Escrow & Payment Settlement
- **Secure escrow smart contract ensures fair payments — HBAR is released only after title transfer
- **Automated logic through Hedera smart contracts.
- **Fully auditable transactions via Hedera HashScan.

###🪙 Tokenized Land Titles
- **Land ownership is represented as NFTs minted on the Hedera Token Service (HTS).
- **Transferable, verifiable, and publicly traceable.

### ⚙️ Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React (Next.js), Tailwind CSS, Framer Motion |
| Backend | Node.js (Express / NestJS) |
| Blockchain | Hedera Hashgraph – HTS, HCS,Smart Contracts 
| Wallet Integration |HashConnect / Hedera Wallet Snap |
| Storage | IPFS / Web3.Storage |
| Authentication | Decentralized Identifiers (DIDs) |
| Payments | HBAR Escrow Smart Contracts | 
| Data Access | Hedera Mirror Node APIs|

##🏗️ Architecture
```

Frontend (React / Next.js + HashConnect)
   │
   ├── User Actions: list land, verify, purchase
   ↓
Backend (Node.js API)
   ├── Uploads documents → IPFS
   ├── Submits messages → HCS (immutability)
   ├── Calls → HTS (mint/transfer NFT)
   ├── Executes → Smart Contract (escrow/verification)
   ↓
Hedera Network
   ├── HTS: Land Title NFTs
   ├── HCS: Logging of events
   ├── Smart Contracts: Escrow & Multi-Sig logic
   └── Mirror Node: Public read access
```

Flow:
1️⃣ Seller lists property → IPFS upload → backend submits to HCS.
2️⃣ Inspectors verify → multi-sign → on-chain record.
3️⃣ NFT minted on HTS → buyer purchases via wallet.
4️⃣ Escrow releases payment → ownership transferred → logged on HashScan.

##💡 Hedera Integration Summary

###🪙 Hedera Token Service (HTS)
- **Used for tokenizing land as NFTs
Why: Native tokenization, low fees, high speed.
- **Transactions: TokenCreateTransaction, TokenMintTransaction, TokenTransferTransaction.
  Benefit: Enables low-cost, real-asset trading at scale.

###💬 Hedera Consensus Service (HCS)
- **Used for event logging (listings, approvals, transfers).
Why: Immutable and auditable event history.
- **Transactions: TopicCreateTransaction, TopicMessageSubmitTransaction.
Benefit: Eliminates disputes and ensures trust via public ledger transparency.

###⚖️ Smart Contracts
- **Used for escrow and verification automation.
 Why: Trustless and transparent settlement.
- **Transactions: ContractCreateTransaction, ContractExecuteTransaction.
 Benefit: Ensures no funds move unless both parties meet conditions.

###🧮 Economic Justification
**Low Fees**: Hedera’s predictable fees (<$0.001 per tx) make the platform accessible to low-income rural users.
**Speed**: Finality in seconds enables real-time transactions.
**Scalability**: High throughput supports large national land registries.
**Trust**: Transparent and public audit trail reduces corruption and fraud.

##🚀 Quick Start

###Prerequisites
- **Node.js ≥ 18
-**npm or yarn
-**Hedera testnet account with HBAR
-**HashPack Wallet
-**IPFS or Web3.Storage API key

###Installation
```
# Clone repository
git clone https://github.com/Hedera-Bima/bima.git
cd bima
# Install dependencies
npm install
```

###Backend Setup
```
cd backend
npm install
npm run start
```
Runs on http://localhost:5000

###Frontend Setup
```
cd ../frontend
npm install
npm run dev
```
Runs on http://localhost:3000

###Environment Variables
**Create .env or .env.local file in the project root.**
```
HEDERA_ACCOUNT_ID=0.0.xxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420xxxxxxxxxxxxxxxx
NETWORK=testnet
ESCROW_CONTRACT_ID=0.0.xxxxx
VERIFICATION_CONTRACT_ID=0.0.xxxxx
LAND_TOKEN_ID=0.0.xxxxx
HCS_TOPIC_ID=0.0.xxxxx
IPFS_API_KEY=your_web3storage_api_key
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com/api/v1/
```

###🗂️ Project Structure
```
/bima
 ├── /frontend          # Next.js React UI
 ├── /backend           # Node.js API + Smart contract logic
 ├── package.json
 ├── .gitignore
 └── README.md
```

##🧾 Deployed Hedera IDs (Testnet)
| Service | ID | Description |
|---------|----|-------------|
| Land Title NFT (HTS) | 0.0.5432109 | Represents land parcels |
| Escrow Smart Contract | 0.0.6327451 |Handles payments |
| Verification Smart Contract | 0.0.6327452 | Manages inspector signatures |
| HCS Topic | 0.0.8754432| Records transactions |
| Mirror Node API | https://testnet.mirrornode.hedera.com/api/v1/ | Read-only ledger data |
(Replace placeholders with live Testnet IDs.)

##🌟 Core Features
| Feature | Description |
| --------|-------------|
| DIDs Integration | Each user has a verifiable decentralized identity |
| Land Title NFTs |Tokenized ownership with metadata |
| Smart Escrow |HBAR escrow and automatic payment release |
| Transparency Layer |All actions visible via HashScan |
| Reputation NFTs | Soulbound tokens for trusted inspectors |

##🌍 Social & Economic Impact
**🛡️ Anti-Fraud**: Removes document forgery and duplicate titles
**👩🏽‍🌾 Empowerment**: Recognizes local chiefs/surveyors as verifiers
**⚡ Efficiency**: From months to minutes for title transfers
**🧭 Transparency**: Public, tamper-proof land registry
**🤝 Trust**: Bridges traditional land systems with digital security


##🧰 .env.sample
```
# Hedera Configuration
HEDERA_ACCOUNT_ID=0.0.xxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420xxxxxxxxxxxx
NETWORK=testnet

# Smart Contracts
ESCROW_CONTRACT_ID=0.0.xxxxx
VERIFICATION_CONTRACT_ID=0.0.xxxxx

# Token & Topic
LAND_TOKEN_ID=0.0.xxxxx
HCS_TOPIC_ID=0.0.xxxxx

# IPFS & API
IPFS_API_KEY=your_web3storage_api_key
MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com/api/v1/
```

##👥 Team

| Name | Role | Contact |
|------|------|---------|
| Mary Njoroge|Smart contact Developer |marrianapeters00@gmail.com |
| John Mokaya |Frontend Developer | mokayaj857@gmail.com |
|Joseph Okumu | Back end Developer |https://github.com/JosephOkumu#joseph-okumu |
| Irene Nditi |Smart contract Developer|https://github.com/Irenenditi |

##📄 License
-**This project is licensed under the MIT License.
 See the LICENSE file for full details.



