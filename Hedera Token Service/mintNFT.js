import { TokenMintTransaction, PrivateKey } from "@hashgraph/sdk";
import { createClient } from "./connect.js";
import { uploadJSONToIPFS } from "./uploadToIPFS.js";

export async function mintNFT({ tokenId, metadata, metadataHash }) {
  const resolvedTokenId = tokenId || process.env.TOKEN_ID;
  if (!resolvedTokenId) {
    throw new Error("TOKEN_ID is required (pass tokenId or set env TOKEN_ID)");
  }
  if (!process.env.OPERATOR_ID || !process.env.OPERATOR_KEY) {
    throw new Error("Missing Hedera credentials: OPERATOR_ID/OPERATOR_KEY");
  }

  const client = createClient();

  let cid = metadataHash;
  if (!cid) {
    if (!metadata || typeof metadata !== "object") {
      throw new Error("Provide metadata object or metadataHash string");
    }
    cid = await uploadJSONToIPFS(metadata);
  }

  const mintTx = new TokenMintTransaction()
    .setTokenId(resolvedTokenId)
    .addMetadata(Buffer.from(cid))
    .freezeWith(client);

  const signTx = await mintTx.sign(PrivateKey.fromString(process.env.OPERATOR_KEY));
  const resp = await signTx.execute(client);
  const receipt = await resp.getReceipt(client);
  const serial = receipt.serials && receipt.serials[0] ? receipt.serials[0].toString() : null;

  return {
    success: receipt.status && receipt.status.toString ? receipt.status.toString() === "SUCCESS" : true,
    status: receipt.status ? receipt.status.toString() : "UNKNOWN",
    serial,
    metadataHash: cid,
    tokenId: resolvedTokenId
  };
}


