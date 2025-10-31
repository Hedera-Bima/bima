import { Client } from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();

export function createClient() {
  const client = Client.forTestnet();
  client.setOperator(process.env.OPERATOR_ID, process.env.OPERATOR_KEY);
  return client;
}
