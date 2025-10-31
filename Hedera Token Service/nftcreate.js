import {
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  Client,
  AccountId,
  PrivateKey
} from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();

const client = Client.forTestnet().setOperator(
  AccountId.fromString(process.env.OPERATOR_ID),
  PrivateKey.fromString(process.env.OPERATOR_KEY)
);

async function main() {
  const tokenCreateTx = new TokenCreateTransaction()
    .setTokenName("BIMA Land Title")
    .setTokenSymbol("BIMA")
    .setTokenType(TokenType.NonFungibleUnique)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(10000)
    .setTreasuryAccountId(process.env.OPERATOR_ID)
    .setSupplyKey(PrivateKey.fromString(process.env.OPERATOR_KEY))
    .freezeWith(client);

  const signTx = await tokenCreateTx.sign(
    PrivateKey.fromString(process.env.OPERATOR_KEY)
  );
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);

  console.log("✅ Token ID:", receipt.tokenId.toString());
}

main();