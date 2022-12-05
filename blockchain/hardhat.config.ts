import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const GANACHE_URL = process.env.GANACHE_URL!;

console.log(GANACHE_URL)

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    testnet: {
      url: GANACHE_URL,
      gasPrice: 25000000000,
      accounts: [PRIVATE_KEY],
    },
  }
};

export default config;
