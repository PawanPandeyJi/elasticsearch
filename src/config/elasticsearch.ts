import { Client } from "@elastic/elasticsearch";
import fs from "fs";

if (
  !process.env.ES_NODE_URL ||
  !process.env.ES_USERNAME ||
  !process.env.ES_PASSWORD ||
  !process.env.ES_CA
) {
  throw new Error("One or more required environment veriables are missing!!");
}

export const client = new Client({
  node: process.env.ES_NODE_URL,
  auth: {
    username: process.env.ES_USERNAME,
    password: process.env.ES_PASSWORD,
  },
  tls: {
    ca: fs.readFileSync(process.env.ES_CA),
    rejectUnauthorized: false,
  },
});

export async function checkConnection() {
  try {
    const info = await client.info();
    console.log("Elasticsearch is connected:", info);
  } catch (error) {
    console.error("Elasticsearch connection failed:", error);
  }
}
