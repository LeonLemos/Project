require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKeys = process.env.PRIVATE_KEYS || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {},
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: privateKeys.split(",")
    }
  },
  solidity: "0.8.20",
};
