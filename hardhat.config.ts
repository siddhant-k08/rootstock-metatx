import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";
import * as dotenv from "dotenv";
import { rootstockTestnet } from "viem/chains";

// ✅ Load env variables
dotenv.config();

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    rootstockTestnet: {
      type: "http",
      // ✅ fixed URL
      url: process.env.ROOTSTOCK_RPC_URL || "https://rpc.testnet.rootstock.io",
      chainId: 31,
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
      gasPrice: 60000000,
    },
  },
});