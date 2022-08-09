import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.URL,
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

export default config;
