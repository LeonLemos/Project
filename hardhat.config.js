require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          blockGasLimit: 60000000 // Network block gasLimit
      },
  },
  solidity: "0.8.20",
};
