🏞️ BIMA: A Decentralized Land Marketplace for Trust, Speed, and On-Chain Security
Version 1.0

“BIMA” is Swahili for land or property.
The platform empowers individuals and communities to own, verify, and trade land transparently using blockchain and decentralized identity.


📘 Table of Contents


Project Overview


Problem Statement


Objectives


Solution Overview


Key Innovation Features


Ecosystem Participants


Technical Architecture


Workflow Summary


Installation & Setup


Running the dApp


Smart Contract Deployment


Value Proposition


Social & Economic Impact


Use of Hedera Network


License



1. 🧩 Project Overview
BIMA is a decentralized digital land marketplace built on Hedera Hashgraph, enabling secure, fast, and transparent land ownership transactions.
The system leverages:


NFTs (tokenized land titles)


Decentralized Identifiers (DIDs)


Smart escrow contracts


IPFS for document storage


All participants — buyers, sellers, and inspectors — interact through a trustless, verifiable, and auditable network.

2. ⚠️ Problem Statement
Land management in emerging economies faces:


Fraudulent / duplicate titles.


Bureaucratic verification delays.


Low trust among stakeholders.


Lack of transparency and public access.


BIMA eliminates these inefficiencies using blockchain trust, verified identities, and public auditability.

3. 🎯 Objectives


Tokenize verified land ownership via NFTs on Hedera Token Service (HTS).


Empower inspectors (chiefs, surveyors, land officers) with DIDs for verifiable credentials.


Record all activities — listing, approval, payment, transfer — on-chain.


Automate escrow payments through smart contracts.


Build community trust using reputation NFTs and transparent verification.



4. 🛠️ Solution Overview
BIMA simplifies land transactions by replacing paperwork with digital trust.
🔹 How It Works


Seller lists land → uploads docs to IPFS.


Inspectors review and dual-sign verification.


System mints land title NFT on Hedera Token Service.


Buyer purchases land using HBAR.


Smart contract holds funds in escrow until transfer confirmed.


Every event is logged on-chain and viewable via HashScan.



5. 💡 Key Innovation Features
|**Feature**||**Description**|
|Decentralized Identifiers (DIDs)| |Verifiable digital identity for all actors.|
|Land Title Tokenization| |Land titles minted as NFTs on Hedera.|
|Multi-Signature Verification| |Dual inspector approval before minting.|
|Reputation NFTs (Soulbound)| |Inspectors earn badges: Bronze, Silver, Gold.|
|Smart Escrow Payments| |Automatic HBAR escrow for fairness.|
|Transparency Layer| |Public ledger traceability via Mirror Node APIs.|

7. 👥 Ecosystem Participants
🧑‍💼 Buyers


Purchase verified land titles via wallet.


View complete transaction history on-chain.


🧑‍🌾 Sellers


Create verified listings.


Automatically receive payments after NFT transfer.


🧭 Inspectors


Approve listings using multi-sig.


Build reputation through transparent validation.



7. 🏗️ Technical Architecture
LayerTechnology StackFrontendReact (Next.js), Tailwind CSS, Framer MotionWallet IntegrationHashConnect / Hedera Wallet SnapBlockchainHedera Hashgraph (HTS + HCS)StorageIPFS / Web3.StorageBackendNode.js (Express / NestJS)AuthenticationDIDs (Decentralized Identifiers)PaymentsHBAR Smart Escrow ContractsData AccessHedera Mirror Node APIs

8. 🔁 Workflow Summary
flowchart TD
    A[Seller submits land data] --> B[Documents uploaded to IPFS]
    B --> C[Inspectors review + approve]
    C --> D[Dual-sign verification recorded on-chain]
    D --> E[System mints land NFT via HTS]
    E --> F[Buyer purchases via HBAR wallet]
    F --> G[Smart escrow holds payment]
    G --> H[Ownership NFT transferred to buyer]
    H --> I[All actions logged on HashScan]


9. ⚙️ Installation & Setup
✅ Prerequisites


Node.js v18+


npm or yarn


Hedera Testnet Account (create here)


HashPack Wallet or MetaMask + Hedera Snap


IPFS / Web3.Storage API key


🪶 Clone the Repository
git clone https://github.com/Hedera-Bima/bima.git
cd bima

📦 Install Dependencies
npm install
# or
yarn install

🔐 Create Environment File
Create a .env file in the project root:
HEDERA_ACCOUNT_ID=0.0.xxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420xxxxxxxxxxxxxxxx
IPFS_API_KEY=your_web3storage_api_key
NETWORK=testnet


10. 🚀 Running the dApp
🖥️ Start Local Development Server
npm run dev
# or
yarn dev

Visit http://localhost:3000 in your browser.
🔗 Connect Wallet


Open HashPack Wallet → Connect via HashConnect popup.


Approve permissions for bima-dapp.



11. 💾 Smart Contract Deployment
📜 Deploy Escrow & Verification Contracts
Using Hedera SDK (Node.js):
node scripts/deployEscrow.js
node scripts/deployVerification.js

Each script will output the contract ID — save these in .env:
ESCROW_CONTRACT_ID=0.0.xxxxx
VERIFICATION_CONTRACT_ID=0.0.xxxxx

🔍 Test Contract Functionality
Run sample scripts to simulate workflow:
npm run test:escrow
npm run test:mint

You can view all actions on:
👉 Hedera HashScan Explorer

12. 💼 Value Proposition
|**Stakeholder**| |**Benefit***|
|Buyers| |Transparent, fraud-proof transactions.|
|Sellers| |Instant, digitized sales.|
|Inspectors| |Reputation growth + DID credentials.|
|Governments / NGOs| |Reliable, auditable land data.|
|Communities| |Trust and inclusivity through decentralization.|

14. 🌍 Social & Economic Impact


🧾 Anti-Fraud: Removes forged/duplicate documents.


⚖️ Inclusivity: Secures ownership for rural citizens.


🌱 Empowerment: Restores faith in local authorities.


⚡ Efficiency: Transactions complete in minutes.


🔍 Transparency: Tamper-proof public registry.



14. ☁️ Use of Hedera Network
BIMA is powered by Hedera Hashgraph, chosen for:


⚡ High throughput + low fees


🌿 Carbon-negative consensus


🪙 Native NFT & tokenization support


🔍 Public auditability via Mirror Nodes


🏛️ Stable governance by the Hedera Council



🪪 License
This project is licensed under the MIT License.
See the LICENSE file for details.

✨ Contributors
|**Name**|**Role** |
|John Mokaya|FrontEnd Developer|
|Joseph Okumu|Back End Developer|
|Mary Njoroge|Project Manager|
|Irene Njoroge|Smat Contract Developer|
