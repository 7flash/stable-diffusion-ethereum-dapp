import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@cronos-labs/hardhat-cronoscan";

import dotenv from "dotenv";
dotenv.config();

const accounts = [];
if (process.env.PRIVATE_KEY) {
  accounts.push(process.env.PRIVATE_KEY)
}

const cronoscanApiKey = process.env.CRONOSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},
    development: {
      url: "http://localhost:8545",
      accounts,
    },
    cronosTestnet: {
      url: "https://evm-t3.cronos.org/",
      chainId: 338,
      accounts,
    },
    cronos: {
      url: "https://evm.cronos.org/",
      chainId: 25,
      accounts,
    }
  },
  etherscan: {
    apiKey: {
      cronos: cronoscanApiKey,
      cronosTestnet: cronoscanApiKey,
    }
  }
};

export default config;
